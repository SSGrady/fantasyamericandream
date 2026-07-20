import { tickSixMonthsWithSimulation } from '@fad/sim-engine';
import type {
  Accounts,
  ActionCommand,
  AuditSnapshot,
  CareerState,
  Debts,
  Difficulty,
  HouseholdState,
  IsoDate,
  LocationState,
  MacroState,
  PlayerState,
} from '@fad/shared';
import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ImpactRequestBody {
  startDate: IsoDate;
  randomSeed: string;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  location: LocationState;
  household: HouseholdState;
  player: Pick<PlayerState, 'habits' | 'includeEmployerHealthPlan'> & { ageYears?: number };
  macro: MacroState;
  baselineDeferral401kRate: number;
  chosenDeferral401kRate: number;
  difficulty?: Difficulty;
  enabledModules?: string[];
  activeCommands?: ActionCommand[];
  baselineCommands?: ActionCommand[];
}

const impactCache = new Map<string, ImpactPreviewResponse>();
const IMPACT_CACHE_MAX = 64;

function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCommands(value: unknown): ActionCommand[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as ActionCommand[];
}

function parseImpactRequest(body: unknown): ImpactRequestBody | null {
  if (!isObject(body)) return null;
  if (!isIsoDate(body.startDate)) return null;
  if (typeof body.randomSeed !== 'string' || body.randomSeed.length === 0) return null;
  if (!isObject(body.accounts) || !isObject(body.debts)) return null;
  if (!isObject(body.career) || !isObject(body.location) || !isObject(body.macro)) return null;
  if (!isObject(body.household) || !isObject(body.player)) return null;
  if (typeof body.baselineDeferral401kRate !== 'number') return null;
  if (typeof body.chosenDeferral401kRate !== 'number') return null;

  return {
    startDate: body.startDate,
    randomSeed: body.randomSeed,
    accounts: body.accounts as unknown as Accounts,
    debts: body.debts as unknown as Debts,
    career: body.career as unknown as CareerState,
    location: body.location as unknown as LocationState,
    household: body.household as unknown as HouseholdState,
    player: body.player as unknown as Pick<
      PlayerState,
      'habits' | 'includeEmployerHealthPlan' | 'ageYears'
    >,
    macro: body.macro as unknown as MacroState,
    baselineDeferral401kRate: body.baselineDeferral401kRate,
    chosenDeferral401kRate: body.chosenDeferral401kRate,
    difficulty:
      body.difficulty === 'easy' || body.difficulty === 'medium' || body.difficulty === 'hard'
        ? body.difficulty
        : undefined,
    enabledModules: Array.isArray(body.enabledModules)
      ? body.enabledModules.filter((id): id is string => typeof id === 'string')
      : undefined,
    activeCommands: parseCommands(body.activeCommands),
    baselineCommands: parseCommands(body.baselineCommands),
  };
}

export interface ImpactPreviewResponse {
  baselineAudit: AuditSnapshot;
  chosenAudit: AuditSnapshot;
  deltaNetWorth: number;
  deltaRunwayMonths: number;
  deltaSavingsRate: number;
  isFlatPreview: boolean;
  flatPreviewReason?: string;
}

function commandSignature(commands: ActionCommand[] | undefined): string {
  if (!commands || commands.length === 0) return '';
  return commands
    .map((command) => JSON.stringify(command))
    .sort()
    .join('|');
}

function impactCacheKey(input: ImpactRequestBody): string {
  const payload = JSON.stringify({
    startDate: input.startDate,
    randomSeed: input.randomSeed,
    baselineDeferral401kRate: input.baselineDeferral401kRate,
    chosenDeferral401kRate: input.chosenDeferral401kRate,
    difficulty: input.difficulty,
    enabledModules: input.enabledModules,
    activeCommands: commandSignature(input.activeCommands),
    baselineCommands: commandSignature(input.baselineCommands),
    accounts: input.accounts,
    debts: input.debts,
    career: input.career,
    location: input.location,
    household: input.household,
    player: input.player,
    macro: input.macro,
  });
  return createHash('sha256').update(payload).digest('hex');
}

function buildImpactResponse(
  baselineAudit: AuditSnapshot,
  chosenAudit: AuditSnapshot,
  options?: { flatPreviewReason?: string },
): ImpactPreviewResponse {
  const deltaNetWorth = chosenAudit.netWorth - baselineAudit.netWorth;
  const deltaRunwayMonths = chosenAudit.emergencyRunwayMonths - baselineAudit.emergencyRunwayMonths;
  const deltaSavingsRate = chosenAudit.savingsRate - baselineAudit.savingsRate;
  const isFlatPreview =
    deltaNetWorth === 0 && deltaRunwayMonths === 0 && Math.abs(deltaSavingsRate) < 0.0001;

  return {
    baselineAudit,
    chosenAudit,
    deltaNetWorth,
    deltaRunwayMonths,
    deltaSavingsRate,
    isFlatPreview,
    flatPreviewReason: isFlatPreview
      ? options?.flatPreviewReason ??
        'Chosen commands match baseline on this seed. Adjust deferrals or commands to see a delta.'
      : undefined,
  };
}

function rememberImpact(key: string, response: ImpactPreviewResponse): void {
  impactCache.set(key, response);
  if (impactCache.size > IMPACT_CACHE_MAX) {
    const firstKey = impactCache.keys().next().value;
    if (firstKey) impactCache.delete(firstKey);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const input = parseImpactRequest(body);
  if (!input) {
    return NextResponse.json({ error: 'Invalid impact request' }, { status: 400 });
  }

  const cacheKey = impactCacheKey(input);
  const cached = impactCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const shared = {
      startDate: input.startDate,
      randomSeed: input.randomSeed,
      accounts: input.accounts,
      debts: input.debts,
      career: input.career,
      location: input.location,
      household: input.household,
      player: input.player,
      macro: input.macro,
      difficulty: input.difficulty,
      enabledModules: input.enabledModules,
      activeCommands: input.activeCommands,
    };

    const deferralsMatch =
      Math.abs(input.baselineDeferral401kRate - input.chosenDeferral401kRate) < 0.0001;
    const commandsMatch =
      commandSignature(input.activeCommands) === commandSignature(input.baselineCommands);

    if (deferralsMatch && commandsMatch) {
      const single = tickSixMonthsWithSimulation({
        ...shared,
        deferral401kRate: input.baselineDeferral401kRate,
      });
      const response = buildImpactResponse(single.audit, single.audit, {
        flatPreviewReason:
          'Baseline and chosen deferrals plus commands are identical for this preview window.',
      });
      rememberImpact(cacheKey, response);
      return NextResponse.json(response);
    }

    const baseline = tickSixMonthsWithSimulation({
      ...shared,
      deferral401kRate: input.baselineDeferral401kRate,
      activeCommands: input.baselineCommands,
    });
    const chosen = tickSixMonthsWithSimulation({
      ...shared,
      deferral401kRate: input.chosenDeferral401kRate,
      activeCommands: input.activeCommands,
    });

    const response = buildImpactResponse(baseline.audit, chosen.audit);
    rememberImpact(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impact simulation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
