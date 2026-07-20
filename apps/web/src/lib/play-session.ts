import type { AuditSnapshot, GameState } from '@fad/shared';
import type { TickSixMonthsResult } from '@fad/sim-engine';
import type { V1CharacterDraft, V1RunConfig } from '@fad/shared';
import { buildInitialGameState } from './build-game-state';
import { loadCharacterDraft } from './character-draft';
import { loadRunConfig } from './run-config';

const STORAGE_KEY = 'fad:play-session';
const MAX_PERIODS = 4;

export type PendingDecisionKind = 'required' | 'opportunity';

export interface PendingDecision {
  id: string;
  kind: PendingDecisionKind;
  title: string;
  description: string;
}

export interface PlaySession {
  gameState: GameState;
  deferral401kRate: number;
  currentAudit: AuditSnapshot | null;
  pendingDecisions: PendingDecision[];
  playerAction: string;
  periodIndex: number;
  maxPeriods: number;
  tickInProgress: boolean;
}

export interface RibbonMetrics {
  netWorth: number;
  netWorthDelta: number;
  takeHomePayMonthly: number;
  savingsRate: number;
  emergencyRunwayMonths: number;
  housingBurdenPct: number;
  dti: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function loadRawSession(): PlaySession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PlaySession;
    if (!isRecord(parsed) || !parsed.gameState?.run) return null;
    return parsed;
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
  const { gameState, deferral401kRate } = buildInitialGameState(draft, config);
  const session: PlaySession = {
    gameState,
    deferral401kRate,
    currentAudit: null,
    pendingDecisions: [],
    playerAction: '',
    periodIndex: 0,
    maxPeriods: MAX_PERIODS,
    tickInProgress: false,
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
): RibbonMetrics {
  const grossMonthly = gameState.career.baseSalaryAnnual / 12;
  const incomeLine = audit.waterfall.find((line) => line.category === 'income');
  const rentLine = audit.waterfall.find((line) => line.label === 'Rent');
  const periodGross = incomeLine?.amount ?? grossMonthly * 6;
  const takeHomePayMonthly = periodGross > 0 ? periodGross / 6 : grossMonthly * 0.72;
  const rentTotal = rentLine ? Math.abs(rentLine.amount) : gameState.location.rentPaymentMonthly * 6;
  const housingBurdenPct = periodGross > 0 ? rentTotal / periodGross : 0;
  const monthlyDebt =
    gameState.debts.creditCards.reduce((sum, card) => sum + card.minimumPayment, 0) +
    gameState.debts.studentLoans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
  const dti = grossMonthly > 0 ? monthlyDebt / grossMonthly : 0;

  return {
    netWorth: audit.netWorth,
    netWorthDelta: audit.netWorthDelta,
    takeHomePayMonthly,
    savingsRate: audit.savingsRate,
    emergencyRunwayMonths: audit.emergencyRunwayMonths,
    housingBurdenPct,
    dti,
  };
}

export interface SimTickRequest {
  startDate: GameState['run']['currentDate'];
  randomSeed: string;
  accounts: GameState['accounts'];
  debts: GameState['debts'];
  career: GameState['career'];
  location: GameState['location'];
  macro: GameState['macro'];
  deferral401kRate: number;
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
    pendingDecisions: buildPendingDecisions(tick.audit, {
      ...session.gameState,
      accounts: tick.accounts,
      debts: tick.debts,
      career: tick.career,
    }),
    periodIndex: session.periodIndex + 1,
    tickInProgress: false,
  };
  savePlaySession(next);
  return next;
}

export function formatPeriodLabel(currentDate: string): string {
  const date = new Date(`${currentDate}T00:00:00Z`);
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const half = month < 6 ? 'H1' : 'H2';
  return `${half} ${year} briefing`;
}

export function isSimulationComplete(session: PlaySession): boolean {
  return session.periodIndex >= session.maxPeriods;
}
