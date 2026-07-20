import { tickSixMonthsWithSimulation } from '@fad/sim-engine';
import type {
  Accounts,
  CareerState,
  Debts,
  Difficulty,
  IsoDate,
  LocationState,
  MacroState,
} from '@fad/shared';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface TickRequestBody {
  startDate: IsoDate;
  randomSeed: string;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  location: LocationState;
  macro: MacroState;
  deferral401kRate?: number;
  difficulty?: Difficulty;
}

function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

function parseTickRequest(body: unknown): TickRequestBody | null {
  if (!isObject(body)) return null;
  if (!isIsoDate(body.startDate)) return null;
  if (typeof body.randomSeed !== 'string' || body.randomSeed.length === 0) return null;
  if (!isObject(body.accounts) || !isObject(body.debts)) return null;
  if (!isObject(body.career) || !isObject(body.location) || !isObject(body.macro)) return null;

  return {
    startDate: body.startDate,
    randomSeed: body.randomSeed,
    accounts: body.accounts as unknown as Accounts,
    debts: body.debts as unknown as Debts,
    career: body.career as unknown as CareerState,
    location: body.location as unknown as LocationState,
    macro: body.macro as unknown as MacroState,
    deferral401kRate:
      typeof body.deferral401kRate === 'number' ? body.deferral401kRate : undefined,
    difficulty: isDifficulty(body.difficulty) ? body.difficulty : undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const input = parseTickRequest(body);
  if (!input) {
    return NextResponse.json({ error: 'Invalid tick request' }, { status: 400 });
  }

  try {
    const result = tickSixMonthsWithSimulation(input);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Simulation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
