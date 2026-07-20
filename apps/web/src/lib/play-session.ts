import type {
  ActionCommand,
  AuditSnapshot,
  CommandState,
  GameState,
  LiteracySkillId,
  LiteracyProgress,
  SampledEventOccurrence,
  SimulationEndReason,
  V1CharacterDraft,
  V1RunConfig,
} from '@fad/shared';
import {
  createDefaultLiteracyProgress,
  DEFAULT_COMMAND_STATE,
  DEFAULT_HOUSEHOLD,
  LITERACY_SKILL_STUBS,
  validateCommandCapacity,
} from '@fad/shared';
import { netWorth } from '@fad/ledger';
import type {
  EmergencyRunwayBreakdown,
  HousingBurdenBreakdown,
  MetricBreakdownLine,
  SavingsRateBreakdown,
} from '@fad/ledger';
import type { TickSixMonthsResult } from '@fad/sim-engine';
import type { ChapterId, ChapterInterrupt, ChapterPhase } from '@fad/domain';
import {
  buildChapterPeriod,
  CA_ENGINEER_2026,
  evaluateChapterLessonUnlock,
  rollChapterInterrupt,
  applyInterruptCapacityDelta,
  deferralRateFromOffer,
  resolveJobOffer,
  resolvePlanningMode,
  selectRibbonMetrics,
  type ImpactPreview,
  type PendingDecision,
  type PeriodHistoryEntry,
  type RibbonMetrics,
  type RunState,
  RUN_STATE_SCHEMA_VERSION,
  type PlanningMode,
} from '@fad/domain';
import { buildInitialGameState } from './build-game-state';
import { loadCharacterDraft } from './character-draft';
import { loadRunConfig } from './run-config';

const STORAGE_KEY = 'fad:play-session';
const MAX_PERIODS = 4;

export type { ImpactPreview, PendingDecision, PeriodHistoryEntry, RibbonMetrics };
export type PlaySession = RunState;

export interface SkillTreeEntry {
  id: LiteracySkillId;
  title: string;
  track: string;
  unlocks: string[];
  status: 'locked' | 'in_progress' | 'unlocked';
}

/** @deprecated Use RunState from @fad/domain */
export type { RunState };

export interface MetricBreakdown {
  savingsRate: SavingsRateBreakdown;
  housingBurden: HousingBurdenBreakdown;
  emergencyRunway: EmergencyRunwayBreakdown;
}

function sumWaterfallLabels(waterfall: AuditSnapshot['waterfall'], labels: string[]): number {
  return waterfall
    .filter((line) => labels.includes(line.label))
    .reduce((sum, line) => sum + line.amount, 0);
}

export function computeMetricBreakdown(
  audit: AuditSnapshot,
  gameState: GameState,
  periodMonths = 6,
): MetricBreakdown {
  if (audit.metricBreakdown) {
    return audit.metricBreakdown;
  }

  const periodNetPayCents = audit.periodNetPayCents;
  const deferrals = sumWaterfallLabels(audit.waterfall, ['401(k) deferrals', 'Partner 401(k) deferrals']);
  const savingsInflowsCents = Math.round(audit.savingsRate * periodNetPayCents);

  const savingsRate: SavingsRateBreakdown = {
    savingsInflowsCents,
    periodNetPayCents,
    rate: audit.savingsRate,
    deferral401kRate: audit.deferral401kRate ?? deferrals / Math.max(periodNetPayCents, 1),
    cashSurplusRate:
      audit.cashSurplusRate ??
      (savingsInflowsCents - deferrals) / Math.max(periodNetPayCents, 1),
    deferral401kCents: deferrals,
    cashSurplusCents: Math.max(0, savingsInflowsCents - deferrals),
    formula:
      'Sum of payroll 401(k) deferrals and post-payday transfers to HYSA, brokerage, Roth, or HSA, divided by net pay deposited to checking. Investment returns are excluded.',
    lines: [
      { label: 'Net pay to checking (denominator)', amountCents: periodNetPayCents },
      ...(deferrals > 0 ? [{ label: '401(k) payroll deferrals', amountCents: deferrals }] : []),
      ...(savingsInflowsCents > deferrals
        ? [
            {
              label: 'Transfers to savings accounts',
              amountCents: savingsInflowsCents - deferrals,
            },
          ]
        : []),
      ...(savingsInflowsCents > 0
        ? [{ label: 'Total savings inflows (numerator)', amountCents: savingsInflowsCents }]
        : []),
    ],
  };

  const periodRentShareCents = Math.abs(sumWaterfallLabels(audit.waterfall, ['Rent']));
  const monthlyNetPayCents = periodMonths > 0 ? periodNetPayCents / periodMonths : 0;
  const monthlyRentShareCents = periodMonths > 0 ? periodRentShareCents / periodMonths : 0;

  const housingBurden: HousingBurdenBreakdown = {
    periodRentShareCents,
    periodNetPayCents,
    monthlyRentShareCents,
    monthlyNetPayCents,
    rate: monthlyNetPayCents > 0 ? monthlyRentShareCents / monthlyNetPayCents : 0,
    formula: 'Player rent share from expense:rent postings divided by monthly net pay.',
    lines: [
      { label: 'Rent (player share, numerator)', amountCents: periodRentShareCents },
      { label: 'Net pay to checking (denominator basis)', amountCents: periodNetPayCents },
    ],
  };

  const burnLines: MetricBreakdownLine[] = audit.waterfall
    .filter((line) => line.category === 'expense')
    .map((line) => ({
      label: `${line.label} (6-month total)`,
      amountCents: Math.abs(line.amount),
    }));

  const periodBurn = burnLines.reduce((sum, line) => sum + line.amountCents, 0);
  const monthlyBurnCents = periodMonths > 0 ? periodBurn / periodMonths : 0;

  const emergencyRunway: EmergencyRunwayBreakdown = {
    checkingBalanceCents: gameState.accounts.checking.balance,
    monthlyBurnCents,
    months: audit.emergencyRunwayMonths,
    formula:
      'Checking balance divided by monthly essential burn from the audit period. Burn includes rent, baseline living expenses (insurance, utilities, groceries, subscriptions), childcare, payroll taxes, and debt service.',
    burnComponents: burnLines,
  };

  return { savingsRate, housingBurden, emergencyRunway };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeSession(parsed: PlaySession): PlaySession {
  const legacyOfferId =
    (parsed as { selectedJobOfferId?: string | null }).selectedJobOfferId ?? parsed.acceptedOfferId;
  const startingNetWorth =
    parsed.startingNetWorth ??
    netWorth(parsed.gameState.accounts, parsed.gameState.debts);
  const startingRothBalance =
    parsed.startingRothBalance ?? parsed.gameState.accounts.rothIra.balance;
  const chapterPeriod =
    parsed.chapterPeriod ??
    buildChapterPeriod(
      parsed.gameState.run.currentDate,
      parsed.currentAudit ? 'closed' : 'planned',
    );

  return {
    ...parsed,
    schemaVersion: RUN_STATE_SCHEMA_VERSION,
    startingNetWorth,
    startingRothBalance,
    acceptedOfferId: legacyOfferId ?? CA_ENGINEER_2026.defaultOfferId,
    offerAccepted: parsed.offerAccepted ?? legacyOfferId !== null,
    chapterPeriod,
    gameState: {
      ...parsed.gameState,
      household: parsed.gameState.household ?? DEFAULT_HOUSEHOLD,
    },
    periodHistory: (parsed.periodHistory ?? []).map((entry) => ({
      ...entry,
      startNetWorth: entry.startNetWorth ?? startingNetWorth,
    })),
    endReason: parsed.endReason ?? null,
    endedByDemoLimit: parsed.endedByDemoLimit ?? false,
    literacyQuizAnswered: parsed.literacyQuizAnswered ?? false,
    literacyProgress: parsed.literacyProgress ?? createDefaultLiteracyProgress(),
    periodEvents: parsed.periodEvents ?? [],
    dreamHomeChoiceId: parsed.dreamHomeChoiceId ?? null,
    dreamHomeBlocked: parsed.dreamHomeBlocked ?? false,
    impactPreview: parsed.impactPreview ?? null,
    impactPreviewCacheKey: parsed.impactPreviewCacheKey ?? null,
    commandDraft: parsed.commandDraft ?? parsed.gameState.commandState?.activeCommands ?? [],
    commandCapacityError: parsed.commandCapacityError ?? null,
    chapterId: parsed.chapterId ?? 'ca_engineer_2026',
    chapterPhase: parsed.chapterPhase ?? 'briefing',
    activeInterrupt: parsed.activeInterrupt ?? null,
    chapterLessonUnlock: parsed.chapterLessonUnlock ?? null,
  };
}

function loadRawSession(): PlaySession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PlaySession;
    if (!isRecord(parsed) || !parsed.gameState?.run) return null;
    return normalizeSession(parsed);
  } catch {
    return null;
  }
}

export function savePlaySession(session: PlaySession): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearPlaySession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function loadPlaySession(): PlaySession | null {
  return loadRawSession();
}

export function initializePlaySession(
  draft: V1CharacterDraft,
  config: V1RunConfig,
): PlaySession {
  const { gameState, deferral401kRate, startingRothBalance, acceptedOfferId } = buildInitialGameState(
    draft,
    config,
  );
  const startingNetWorth = netWorth(gameState.accounts, gameState.debts);
  const session: PlaySession = {
    schemaVersion: RUN_STATE_SCHEMA_VERSION,
    gameState,
    deferral401kRate,
    startingNetWorth,
    startingRothBalance,
    acceptedOfferId,
    offerAccepted: true,
    chapterPeriod: buildChapterPeriod(gameState.run.currentDate, 'planned'),
    currentAudit: null,
    impactPreview: null,
    impactPreviewCacheKey: null,
    commandDraft: [],
    commandCapacityError: null,
    pendingDecisions: [],
    playerAction: '',
    periodIndex: 0,
    maxPeriods: MAX_PERIODS,
    tickInProgress: false,
    periodHistory: [],
    endReason: null,
    endedByDemoLimit: false,
    literacyQuizAnswered: false,
    literacyProgress: createDefaultLiteracyProgress(),
    periodEvents: [],
    dreamHomeChoiceId: null,
    dreamHomeBlocked: false,
    chapterId: 'ca_engineer_2026',
    chapterPhase: 'briefing',
    activeInterrupt: null,
    chapterLessonUnlock: null,
  };
  savePlaySession(session);
  return session;
}

export function ensurePlaySession(): PlaySession | null {
  const draft = loadCharacterDraft();
  const config = loadRunConfig();
  if (!draft || !config) return null;

  const existing = loadPlaySession();
  if (existing) return existing;

  return initializePlaySession(draft, config);
}

export function buildPendingDecisions(
  audit: AuditSnapshot,
  gameState: GameState,
): PendingDecision[] {
  const decisions: PendingDecision[] = [
    {
      id: 'budget-review',
      kind: 'required',
      title: 'Review spending after this audit',
      description: `Your savings rate was ${(audit.savingsRate * 100).toFixed(0)}% this period. Adjust discretionary spend for the next six months?`,
    },
  ];

  if (gameState.career.employmentType === 'w2') {
    decisions.push({
      id: '401k-deferral',
      kind: 'opportunity',
      title: '401(k) deferral rate',
      description: 'Keep, increase, or pause deferrals for the next six months.',
    });
  }

  if (audit.emergencyRunwayMonths < 3) {
    decisions.push({
      id: 'emergency-fund',
      kind: 'required',
      title: 'Emergency fund below three months',
      description: 'Build cash reserves or cut expenses before the next audit.',
    });
  }

  return decisions;
}

export function computeRibbonMetrics(
  audit: AuditSnapshot,
  gameState: GameState,
  periodMonths = 6,
): RibbonMetrics {
  return selectRibbonMetrics(
    {
      schemaVersion: RUN_STATE_SCHEMA_VERSION,
      gameState,
      deferral401kRate: audit.deferral401kRate ?? 0,
      startingNetWorth: audit.startNetWorth,
      startingRothBalance: gameState.accounts.rothIra.balance,
      acceptedOfferId: CA_ENGINEER_2026.defaultOfferId,
      offerAccepted: true,
      chapterPeriod: buildChapterPeriod(gameState.run.currentDate, 'closed'),
      currentAudit: audit,
      impactPreview: null,
      impactPreviewCacheKey: null,
      commandDraft: [],
      commandCapacityError: null,
      pendingDecisions: [],
      playerAction: '',
      periodIndex: 1,
      maxPeriods: MAX_PERIODS,
      tickInProgress: false,
      periodHistory: [],
      endReason: null,
      endedByDemoLimit: false,
      literacyQuizAnswered: false,
      literacyProgress: createDefaultLiteracyProgress(),
      periodEvents: [],
      dreamHomeChoiceId: null,
      dreamHomeBlocked: false,
      chapterId: 'ca_engineer_2026',
      chapterPhase: 'audit',
      activeInterrupt: null,
      chapterLessonUnlock: null,
    },
    periodMonths,
  );
}

export interface SimTickRequest {
  startDate: GameState['run']['currentDate'];
  randomSeed: string;
  accounts: GameState['accounts'];
  debts: GameState['debts'];
  career: GameState['career'];
  location: GameState['location'];
  household: GameState['household'];
  player: Pick<GameState['player'], 'habits' | 'includeEmployerHealthPlan'> & { ageYears?: number };
  macro: GameState['macro'];
  deferral401kRate: number;
  activeCommands?: ActionCommand[];
  weeklyCapacityHours?: number;
  difficulty: GameState['run']['difficulty'];
  enabledModules: GameState['run']['enabledModules'];
}

export async function runSimTick(input: SimTickRequest): Promise<TickSixMonthsResult> {
  const response = await fetch('/api/sim/tick', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Simulation tick failed');
  }

  return response.json() as Promise<TickSixMonthsResult>;
}

export function applyTickToSession(
  session: PlaySession,
  tick: TickSixMonthsResult,
): PlaySession {
  const historyEntry = appendPeriodHistory(session, tick.audit, session.playerAction || undefined);
  const next: PlaySession = {
    ...session,
    gameState: {
      ...session.gameState,
      run: {
        ...session.gameState.run,
        currentDate: tick.endDate,
      },
      accounts: tick.accounts,
      debts: tick.debts,
      career: tick.career,
      macro: tick.macro,
    },
    currentAudit: tick.audit,
    chapterPeriod: {
      ...session.chapterPeriod,
      status: 'closed',
    },
    pendingDecisions: buildPendingDecisions(tick.audit, {
      ...session.gameState,
      accounts: tick.accounts,
      debts: tick.debts,
      career: tick.career,
    }),
    periodEvents: tick.sampledEvents ?? [],
    periodIndex: session.periodIndex + 1,
    tickInProgress: false,
    periodHistory: [...(session.periodHistory ?? []), historyEntry],
    playerAction: '',
    impactPreview: null,
    impactPreviewCacheKey: null,
    chapterPhase: 'consequence',
    activeInterrupt:
      rollChapterInterrupt(
        CA_ENGINEER_2026,
        session.gameState.run.randomSeed,
        session.periodIndex,
      ) ?? null,
  };
  savePlaySession(next);
  return next;
}

export function appendPeriodHistory(
  session: PlaySession,
  audit: AuditSnapshot,
  playerAction?: string,
): PeriodHistoryEntry {
  return {
    periodIndex: session.periodIndex,
    asOf: audit.asOf,
    startNetWorth: audit.startNetWorth,
    netWorth: audit.netWorth,
    netWorthDelta: audit.netWorthDelta,
    savingsRate: audit.savingsRate,
    emergencyRunwayMonths: audit.emergencyRunwayMonths,
    playerAction,
  };
}

export function computePlayerAge(gameState: GameState): number {
  const birth = new Date(`${gameState.player.birthDate}T00:00:00Z`);
  const asOf = new Date(`${gameState.run.currentDate}T00:00:00Z`);
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = asOf.getUTCMonth() - birth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && asOf.getUTCDate() < birth.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function estimateAnnualExpenses(audit: AuditSnapshot): number {
  const expenseTotal = audit.waterfall
    .filter((line) => line.category === 'expense' || line.category === 'debt')
    .reduce((sum, line) => sum + Math.abs(line.amount), 0);
  return expenseTotal > 0 ? (expenseTotal / 6) * 12 : 48_000_00;
}

export function isCoastFireStub(audit: AuditSnapshot, gameState: GameState): boolean {
  const invested =
    gameState.accounts.brokerage.balance +
    gameState.accounts.traditional401k.balance +
    gameState.accounts.rothIra.balance;
  const annualExpenses = estimateAnnualExpenses(audit);
  return invested >= annualExpenses * 25;
}

export function isInsolvencyStub(audit: AuditSnapshot): boolean {
  return audit.netWorth < 0;
}

export function detectAutomaticEndReason(session: PlaySession): SimulationEndReason | null {
  if (!session.currentAudit) return null;
  const audit = session.currentAudit;

  if (isInsolvencyStub(audit)) return 'insolvency';
  if (computePlayerAge(session.gameState) >= 65) return 'age_65';
  if (isCoastFireStub(audit, session.gameState)) return 'coast_fire';
  if (session.periodIndex >= session.maxPeriods) return 'voluntary';

  return null;
}

export function endSimulation(
  session: PlaySession,
  reason: SimulationEndReason,
  options?: { demoLimit?: boolean },
): PlaySession {
  const next: PlaySession = {
    ...session,
    endReason: reason,
    endedByDemoLimit: options?.demoLimit ?? session.endedByDemoLimit,
    gameState: {
      ...session.gameState,
      run: {
        ...session.gameState.run,
        phase: 'ended',
        endReason: reason,
      },
    },
  };
  savePlaySession(next);
  return next;
}

export function isSimulationEnded(session: PlaySession): boolean {
  return session.endReason !== null || session.gameState.run.phase === 'ended';
}

export function buildSkillTreeProgress(session: PlaySession): SkillTreeEntry[] {
  return LITERACY_SKILL_STUBS.map((skill) => {
    const progress = session.literacyProgress[skill.id];
    const status =
      progress.mastery === 'mastered'
        ? 'unlocked'
        : progress.mastery === 'in_progress'
          ? 'in_progress'
          : 'locked';

    return {
      id: skill.id,
      title: skill.title,
      track: skill.track,
      unlocks: [...skill.unlocks],
      status,
    };
  });
}

export function unlockLiteracySkill(
  session: PlaySession,
  skillId: LiteracySkillId,
): PlaySession {
  const next: PlaySession = {
    ...session,
    literacyProgress: {
      ...session.literacyProgress,
      [skillId]: {
        mastery: 'mastered',
        quizAttempts: session.literacyProgress[skillId].quizAttempts + 1,
        lastAssessedAt: session.gameState.run.currentDate,
      },
    },
  };
  savePlaySession(next);
  return next;
}

export function hasUnlockedSkill(session: PlaySession, skillId: LiteracySkillId): boolean {
  return session.literacyProgress[skillId]?.mastery === 'mastered';
}

export function applyChapterLessonUnlock(session: PlaySession): PlaySession {
  const chapter = CA_ENGINEER_2026;
  const unlock = evaluateChapterLessonUnlock(chapter, session.currentAudit!);
  if (!unlock || session.chapterLessonUnlock) return session;
  const next = unlockLiteracySkill(session, unlock.skillId);
  return { ...next, chapterLessonUnlock: unlock.skillId };
}

export function resolveSessionPlanningMode(session: PlaySession): PlanningMode {
  return resolvePlanningMode({
    periodIndex: session.periodIndex,
    acceptedOfferId: session.acceptedOfferId,
    activeInterrupt: session.activeInterrupt,
  });
}

export function acceptJobOffer(session: PlaySession, offerId: string): PlaySession {
  const chapter = CA_ENGINEER_2026;
  const planningMode = resolveSessionPlanningMode(session);
  const allowRewrite =
    planningMode === 'initialPlan' ||
    planningMode === 'interruptJobOffer' ||
    !session.offerAccepted;

  if (session.offerAccepted && !allowRewrite) {
    return session;
  }

  const offer = resolveJobOffer(chapter, offerId);
  const next: PlaySession = {
    ...session,
    acceptedOfferId: offer.id,
    offerAccepted: true,
    deferral401kRate: deferralRateFromOffer(offer),
    gameState: {
      ...session.gameState,
      career: {
        ...session.gameState.career,
        title: offer.title,
        baseSalaryAnnual: offer.baseSalaryAnnual,
      },
    },
    activeInterrupt:
      session.activeInterrupt?.type === 'competing_offer' ? null : session.activeInterrupt,
  };
  savePlaySession(next);
  return next;
}

/** @deprecated Use acceptJobOffer */
export function applyJobOfferToSession(session: PlaySession, offerId: string): PlaySession {
  return acceptJobOffer(session, offerId);
}

export function resolveChapterInterrupt(
  session: PlaySession,
  choiceId: string,
): PlaySession {
  if (!session.activeInterrupt) return session;
  const capacityDelta = applyInterruptCapacityDelta(session.activeInterrupt, choiceId);
  const weeklyCapacityHours = Math.max(
    4,
    (session.gameState.commandState?.weeklyCapacityHours ?? 14) + capacityDelta,
  );
  const next: PlaySession = {
    ...session,
    activeInterrupt: null,
    gameState: {
      ...session.gameState,
      commandState: {
        ...(session.gameState.commandState ?? DEFAULT_COMMAND_STATE),
        weeklyCapacityHours,
      },
    },
  };
  savePlaySession(next);
  return next;
}

export function getDeferralFromCommands(session: PlaySession): number {
  const cmd = session.commandDraft.find((c) => c.type === 'set_401k_deferral_rate');
  return cmd && cmd.type === 'set_401k_deferral_rate' ? cmd.rate : session.deferral401kRate;
}

export function validateCommandDraftEffect(session: PlaySession): {
  hasEffect: boolean;
  reason?: string;
} {
  const chosenDeferral = getDeferralFromCommands(session);
  if (Math.abs(chosenDeferral - session.deferral401kRate) > 0.0001) {
    return { hasEffect: true };
  }

  const active = session.gameState.commandState?.activeCommands ?? [];
  if (session.commandDraft.length !== active.length) {
    return { hasEffect: true };
  }

  const draftTypes = session.commandDraft.map((command) => command.type).sort().join(',');
  const activeTypes = active.map((command) => command.type).sort().join(',');
  if (draftTypes !== activeTypes) {
    return { hasEffect: true };
  }

  return {
    hasEffect: false,
    reason:
      'Submitted commands match your current plan. Adjust deferrals or add a command to see a preview.',
  };
}

export function beginNextChapterPeriod(session: PlaySession): PlaySession {
  const next: PlaySession = {
    ...session,
    currentAudit: null,
    impactPreview: null,
    impactPreviewCacheKey: null,
    pendingDecisions: [],
    playerAction: '',
    commandDraft: session.gameState.commandState?.activeCommands ?? [],
    chapterPeriod: buildChapterPeriod(session.gameState.run.currentDate, 'planned'),
    chapterPhase: 'briefing',
    tickInProgress: false,
  };
  savePlaySession(next);
  return next;
}

export function commitCommandDraft(session: PlaySession): PlaySession {
  const weeklyCapacityHours =
    session.gameState.commandState?.weeklyCapacityHours ?? DEFAULT_COMMAND_STATE.weeklyCapacityHours;
  const validation = validateCommandCapacity({
    commands: session.commandDraft,
    weeklyCapacityHours,
  });

  if (!validation.ok) {
    const next = {
      ...session,
      commandCapacityError: `Capacity exceeded: ${validation.used}h of ${validation.limit}h weekly budget.`,
    };
    savePlaySession(next);
    return next;
  }

  const commandState: CommandState = {
    schemaVersion: DEFAULT_COMMAND_STATE.schemaVersion,
    activeCommands: session.commandDraft,
    weeklyCapacityHours,
  };

  const next: PlaySession = {
    ...session,
    commandCapacityError: null,
    gameState: {
      ...session.gameState,
      commandState,
    },
  };
  savePlaySession(next);
  return next;
}

export function formatPeriodLabel(currentDate: string): string {
  return formatChapterLabel(currentDate, 0);
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Calendar range for a six-month chapter window ending at asOf. */
export function formatCalendarRange(asOf: string): string {
  const end = new Date(`${asOf}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCMonth(start.getUTCMonth() - 5);
  const startLabel = `${MONTH_NAMES[start.getUTCMonth()]} ${start.getUTCFullYear()}`;
  const endLabel = `${MONTH_NAMES[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  return `${startLabel}-${endLabel}`;
}

/** Chapter header label (calendar range + chapter number). */
export function formatChapterLabel(asOf: string, chapterIndex: number): string {
  const chapterNum = chapterIndex + 1;
  return `Chapter ${chapterNum}: ${formatCalendarRange(asOf)}`;
}

export interface ImpactSimRequest extends SimTickRequest {
  baselineDeferral401kRate: number;
  chosenDeferral401kRate: number;
  activeCommands?: ActionCommand[];
  baselineCommands?: ActionCommand[];
}

export async function runImpactPreview(
  input: ImpactSimRequest,
  signal?: AbortSignal,
): Promise<ImpactPreview> {
  const response = await fetch('/api/sim/impact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Impact preview failed');
  }

  const result = (await response.json()) as Omit<ImpactPreview, 'chosenDeferral401kRate'>;
  return {
    ...result,
    chosenDeferral401kRate: input.chosenDeferral401kRate,
    isFlatPreview: result.isFlatPreview ?? false,
  };
}

export function computeImpactCacheKey(
  session: PlaySession,
  chosenDeferral401kRate: number,
): string {
  return JSON.stringify({
    date: session.gameState.run.currentDate,
    seed: session.gameState.run.randomSeed,
    baseline: session.deferral401kRate,
    chosen: chosenDeferral401kRate,
    action: session.playerAction,
    commands: session.commandDraft.map((command) => JSON.stringify(command)).sort().join('|'),
    baselineCommands: (session.gameState.commandState?.activeCommands ?? [])
      .map((command) => JSON.stringify(command))
      .sort()
      .join('|'),
  });
}

export function isSimulationComplete(session: PlaySession): boolean {
  return session.periodIndex >= session.maxPeriods || isSimulationEnded(session);
}
