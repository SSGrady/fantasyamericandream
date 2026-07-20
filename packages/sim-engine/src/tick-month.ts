import { applyMonthlyTick, applyTransactions, addMonthsToIsoDate, monthKeyAdd, monthKeyFromIsoDate, buildAuditSnapshot } from '@fad/ledger';
import type {
  Accounts,
  AuditSnapshot,
  CareerState,
  Debts,
  Difficulty,
  HouseholdState,
  IsoDate,
  LedgerTransaction,
  LocationState,
  MacroState,
  PlayerState,
  SampledEventOccurrence,
} from '@fad/shared';
import { rollLayoff } from './layoff.js';
import { maybeTransitionRegime, syncMacroToRegime } from './macro-regimes.js';
import { buildInvestmentReturnTransactions, sampleMonthlyReturn } from './market-returns.js';
import { rollEventsForMonth } from './events/roll-events.js';
import { createRng } from './rng.js';

export interface TickMonthInput {
  monthKey: string;
  monthIndex: number;
  randomSeed: string;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  location: LocationState;
  household?: HouseholdState;
  player?: Pick<PlayerState, 'habits' | 'includeEmployerHealthPlan'>;
  macro: MacroState;
  deferral401kRate?: number;
}

export interface TickMonthResult {
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  macro: MacroState;
  transactions: LedgerTransaction[];
  layoffOccurred: boolean;
  monthlyReturn: number;
}

export interface TickMonthsInput {
  startDate: IsoDate;
  months: number;
  randomSeed: string;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  location: LocationState;
  household?: HouseholdState;
  player?: Pick<PlayerState, 'habits' | 'includeEmployerHealthPlan'>;
  macro: MacroState;
  deferral401kRate?: number;
  difficulty?: Difficulty;
}

export interface TickMonthsResult {
  startDate: IsoDate;
  endDate: IsoDate;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  macro: MacroState;
  transactions: LedgerTransaction[];
  monthlyReturns: number[];
  layoffCount: number;
  sampledEvents: SampledEventOccurrence[];
}

function monthRng(randomSeed: string, monthIndex: number): () => number {
  return createRng(`${randomSeed}:${monthIndex}`);
}

export function tickMonthWithSimulation(input: TickMonthInput): TickMonthResult {
  const rng = monthRng(input.randomSeed, input.monthIndex);

  const nextRegime = maybeTransitionRegime(input.macro.regime, rng);
  let macro = syncMacroToRegime(input.macro, nextRegime);

  const layoffResult = rollLayoff(input.career, macro, rng);
  const monthlyReturn = sampleMonthlyReturn(macro.regime, rng);

  const baseTick = applyMonthlyTick({
    monthKey: input.monthKey,
    accounts: input.accounts,
    debts: input.debts,
    career: layoffResult.career,
    location: input.location,
    household: input.household,
    player: input.player,
    deferral401kRate: input.deferral401kRate,
  });

  const returnTransactions = buildInvestmentReturnTransactions(
    input.monthKey,
    baseTick.accounts,
    monthlyReturn,
  );

  const applied = applyTransactions(baseTick.accounts, baseTick.debts, returnTransactions);

  macro = {
    ...macro,
    sp500ReturnYtd: macro.sp500ReturnYtd + monthlyReturn,
  };

  return {
    accounts: applied.accounts,
    debts: applied.debts,
    career: layoffResult.career,
    macro,
    transactions: [...baseTick.transactions, ...returnTransactions],
    layoffOccurred: layoffResult.laidOff,
    monthlyReturn,
  };
}

export interface TickSixMonthsResult extends TickMonthsResult {
  audit: AuditSnapshot;
}

export function tickSixMonthsWithSimulation(
  input: Omit<TickMonthsInput, 'months'>,
): TickSixMonthsResult {
  const startAccounts = structuredClone(input.accounts);
  const startDebts = structuredClone(input.debts);
  const result = tickMonthsWithSimulation({ ...input, months: 6 });
  const audit = buildAuditSnapshot({
    asOf: result.endDate,
    startAccounts,
    startDebts,
    endAccounts: result.accounts,
    endDebts: result.debts,
    transactions: result.transactions,
    periodMonths: 6,
  });

  return { ...result, audit };
}

export function tickMonthsWithSimulation(input: TickMonthsInput): TickMonthsResult {
  let accounts = input.accounts;
  let debts = input.debts;
  let career = input.career;
  let macro = input.macro;
  const transactions: LedgerTransaction[] = [];
  const monthlyReturns: number[] = [];
  let layoffCount = 0;

  const sampledEvents: SampledEventOccurrence[] = [];
  const eventCooldowns = new Map<string, number>();
  const difficulty = input.difficulty ?? 'medium';

  const startMonthKey = monthKeyFromIsoDate(input.startDate);

  for (let i = 0; i < input.months; i += 1) {
    for (const [eventId, remaining] of eventCooldowns.entries()) {
      if (remaining <= 1) eventCooldowns.delete(eventId);
      else eventCooldowns.set(eventId, remaining - 1);
    }

    const monthKey = monthKeyAdd(startMonthKey, i);
    const eventRng = monthRng(input.randomSeed, i + 10_000);
    const monthEvents = rollEventsForMonth(
      {
        monthIndex: i,
        monthKey,
        startDate: input.startDate,
        randomSeed: input.randomSeed,
        career,
        location: input.location,
        macro,
        difficulty,
        cooldowns: eventCooldowns,
      },
      eventRng,
    );
    sampledEvents.push(...monthEvents);

    const tick = tickMonthWithSimulation({
      monthKey,
      monthIndex: i,
      randomSeed: input.randomSeed,
      accounts,
      debts,
      career,
      location: input.location,
      household: input.household,
      player: input.player,
      macro,
      deferral401kRate: input.deferral401kRate,
    });

    accounts = tick.accounts;
    debts = tick.debts;
    career = tick.career;
    macro = tick.macro;
    transactions.push(...tick.transactions);
    monthlyReturns.push(tick.monthlyReturn);
    if (tick.layoffOccurred) {
      layoffCount += 1;
    }
  }

  return {
    startDate: input.startDate,
    endDate: addMonthsToIsoDate(input.startDate, input.months),
    accounts,
    debts,
    career,
    macro,
    transactions,
    monthlyReturns,
    layoffCount,
    sampledEvents,
  };
}
