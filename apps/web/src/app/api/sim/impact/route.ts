import { tickSixMonthsWithSimulation } from '@fad/sim-engine';
import type {
  Accounts,
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
}

function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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
  };
}

export interface ImpactPreviewResponse {
  baselineAudit: AuditSnapshot;
  chosenAudit: AuditSnapshot;
  deltaNetWorth: number;
  deltaRunwayMonths: number;
  deltaSavingsRate: number;
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
    };

    const baseline = tickSixMonthsWithSimulation({
      ...shared,
      deferral401kRate: input.baselineDeferral401kRate,
    });
    const chosen = tickSixMonthsWithSimulation({
      ...shared,
      deferral401kRate: input.chosenDeferral401kRate,
    });

    const response: ImpactPreviewResponse = {
      baselineAudit: baseline.audit,
      chosenAudit: chosen.audit,
      deltaNetWorth: chosen.audit.netWorth - baseline.audit.netWorth,
      deltaRunwayMonths: chosen.audit.emergencyRunwayMonths - baseline.audit.emergencyRunwayMonths,
      deltaSavingsRate: chosen.audit.savingsRate - baseline.audit.savingsRate,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impact simulation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
