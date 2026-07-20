import { IRS_LIMITS_2026 } from '@fad/data';
import type {
  Accounts,
  AuditSnapshot,
  ContributionProgress,
  Debts,
  IsoDate,
  LedgerLine,
  LedgerTransaction,
  MoneyCents,
  NetWorthWaterfallLine,
} from '@fad/shared';
import { applySingleTransaction } from './apply-transaction.js';
import { cloneAccounts, cloneDebts } from './clone-state.js';
import { LIVING_EXPENSE_WATERFALL_LABELS, type LivingExpenseCategory } from './living-expenses.js';
import { applyMonthlyTick, type MonthlyTickInput } from './monthly-tick.js';
import {
  computeEmergencyRunwayBreakdown,
  computeHousingBurdenBreakdown,
  computePeriodNetPay,
  computeSavingsRate,
  computeSavingsRateBreakdown,
} from './metrics.js';
import type { MetricBreakdownSnapshot } from '@fad/shared';
import { netWorth } from './net-worth.js';

export interface SixMonthTickInput {
  startDate: IsoDate;
  accounts: Accounts;
  debts: Debts;
  career: MonthlyTickInput['career'];
  location: MonthlyTickInput['location'];
  household?: MonthlyTickInput['household'];
  player?: MonthlyTickInput['player'];
  deferral401kRate?: number;
}

export interface SixMonthTickResult {
  startDate: IsoDate;
  endDate: IsoDate;
  accounts: Accounts;
  debts: Debts;
  transactions: LedgerTransaction[];
  audit: AuditSnapshot;
}

const ASSET_IDS = new Set(['checking', 'hysa', 'brokerage', 'rothIra', 'traditional401k', 'plan529']);

function isAssetAccountId(accountId: string): boolean {
  return ASSET_IDS.has(accountId);
}

function isLiabilityAccountId(accountId: string): boolean {
  return accountId.startsWith('creditCard:') || accountId.startsWith('studentLoan:');
}

function lineNetWorthDelta(line: LedgerLine): MoneyCents {
  if (isAssetAccountId(line.accountId)) {
    return line.debitCents - line.creditCents;
  }
  if (isLiabilityAccountId(line.accountId)) {
    return line.debitCents - line.creditCents;
  }
  return 0;
}

function transactionNetWorthDelta(tx: LedgerTransaction): MoneyCents {
  return tx.lines.reduce((sum, line) => sum + lineNetWorthDelta(line), 0);
}

function isPartnerPayroll(tx: LedgerTransaction): boolean {
  return tx.id.includes('-payroll-partner') || tx.description.toLowerCase().includes('partner');
}

function payrollWaterfallEntries(
  tx: LedgerTransaction,
): Array<{ label: string; category: NetWorthWaterfallLine['category']; amount: MoneyCents }> {
  const partner = isPartnerPayroll(tx);
  const checkingNet = tx.lines
    .filter((line) => line.accountId === 'checking')
    .reduce((sum, line) => sum + line.debitCents - line.creditCents, 0);
  const deferral401k = tx.lines
    .filter((line) => line.accountId === 'traditional401k')
    .reduce((sum, line) => sum + line.debitCents, 0);

  const entries: Array<{
    label: string;
    category: NetWorthWaterfallLine['category'];
    amount: MoneyCents;
  }> = [];

  if (checkingNet > 0) {
    entries.push({
      label: partner ? 'Partner net pay to checking' : 'Net pay to checking',
      category: 'income',
      amount: checkingNet,
    });
  }
  if (deferral401k > 0) {
    entries.push({
      label: partner ? 'Partner 401(k) deferrals' : '401(k) deferrals',
      category: 'income',
      amount: deferral401k,
    });
  }

  return entries;
}

function waterfallEntriesForTransaction(
  tx: LedgerTransaction,
): Array<{ label: string; category: NetWorthWaterfallLine['category']; amount: MoneyCents }> {
  if (tx.source === 'income') {
    return payrollWaterfallEntries(tx);
  }

  if (tx.source === 'investment_return') {
    const delta = transactionNetWorthDelta(tx);
    if (delta === 0) {
      return [];
    }
    return [{ label: 'Investment returns', category: 'growth', amount: delta }];
  }

  if (tx.source === 'debt_payment') {
    const interest = tx.lines
      .filter((line) => line.accountId === 'expense:studentLoanInterest')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (interest > 0) {
      return [{ label: 'Student loan interest', category: 'expense', amount: -interest }];
    }
    return [];
  }

  if (tx.id.includes('-living-')) {
    const category = tx.id.split('-living-')[1] as LivingExpenseCategory | undefined;
    const label = category ? LIVING_EXPENSE_WATERFALL_LABELS[category] : tx.description;
    const amount = tx.lines
      .filter((line) => line.accountId.startsWith('expense:'))
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (amount > 0) {
      return [{ label, category: 'expense', amount: -amount }];
    }
    return [];
  }

  if (tx.id.includes('-rent')) {
    const rent = tx.lines
      .filter((line) => line.accountId === 'expense:rent')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (rent > 0) {
      return [{ label: 'Rent', category: 'expense', amount: -rent }];
    }
    return [];
  }

  if (tx.id.includes('-childcare')) {
    const childcare = tx.lines
      .filter((line) => line.accountId === 'expense:childcare')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (childcare > 0) {
      return [{ label: 'Childcare', category: 'expense', amount: -childcare }];
    }
    return [];
  }

  if (tx.id.includes('-mortgage-piti')) {
    const piti = tx.lines
      .filter((line) => line.accountId === 'expense:mortgagePiti')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (piti > 0) {
      return [{ label: 'Mortgage PITI', category: 'expense', amount: -piti }];
    }
    return [];
  }

  if (tx.source === 'interest_expense') {
    const interest = tx.lines
      .filter((line) => line.accountId === 'expense:creditCardInterest')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (interest > 0) {
      return [{ label: 'Credit card interest', category: 'expense', amount: -interest }];
    }
    return [];
  }

  if (tx.source === 'transfer') {
    const delta = transactionNetWorthDelta(tx);
    if (delta === 0) {
      return [];
    }
    return [{ label: 'Transfers between accounts', category: 'other', amount: delta }];
  }

  const delta = transactionNetWorthDelta(tx);
  if (delta === 0) {
    return [];
  }

  return [{ label: tx.description, category: 'other', amount: delta }];
}

export function buildWaterfallFromTransactions(
  transactions: LedgerTransaction[],
): NetWorthWaterfallLine[] {
  const buckets = new Map<string, NetWorthWaterfallLine>();

  for (const tx of transactions) {
    for (const entry of waterfallEntriesForTransaction(tx)) {
      const key = `${entry.category}:${entry.label}`;
      const existing = buckets.get(key);
      if (existing) {
        existing.amount += entry.amount;
      } else {
        buckets.set(key, { label: entry.label, category: entry.category, amount: entry.amount });
      }
    }
  }

  return [...buckets.values()].sort((a, b) => {
    const categoryOrder = { income: 0, expense: 1, debt: 2, growth: 3, other: 4 };
    const orderDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (orderDiff !== 0) {
      return orderDiff;
    }
    const incomeOrder = (label: string): number => {
      if (label.includes('Net pay')) return 0;
      if (label.includes('401(k)')) return 1;
      return 2;
    };
    if (a.category === 'income' && b.category === 'income') {
      return incomeOrder(a.label) - incomeOrder(b.label);
    }
    return a.label.localeCompare(b.label);
  });
}

export function buildMetricBreakdownSnapshot(input: {
  transactions: LedgerTransaction[];
  accounts: Accounts;
  periodMonths: number;
}): MetricBreakdownSnapshot {
  const { transactions, accounts, periodMonths } = input;
  return {
    savingsRate: computeSavingsRateBreakdown(transactions),
    housingBurden: computeHousingBurdenBreakdown(transactions, periodMonths),
    emergencyRunway: computeEmergencyRunwayBreakdown({
      checkingBalanceCents: accounts.checking.balance,
      transactions,
      periodMonths,
    }),
  };
}

export function computeAccountInvestmentReturns(
  transactions: LedgerTransaction[],
): Partial<Record<'brokerage' | 'traditional401k' | 'rothIra', MoneyCents>> {
  const returns: Partial<Record<'brokerage' | 'traditional401k' | 'rothIra', MoneyCents>> = {};
  const accountIds = new Set(['brokerage', 'traditional401k', 'rothIra']);

  for (const tx of transactions) {
    if (tx.source !== 'investment_return') {
      continue;
    }

    const suffix = tx.id.split('-return-')[1];
    if (!suffix || !accountIds.has(suffix)) {
      continue;
    }

    const accountId = suffix as 'brokerage' | 'traditional401k' | 'rothIra';
    const delta = tx.lines
      .filter((line) => line.accountId === accountId)
      .reduce((sum, line) => sum + line.debitCents - line.creditCents, 0);
    returns[accountId] = (returns[accountId] ?? 0) + delta;
  }

  return returns;
}

export function buildContributionProgress(accounts: Accounts): Record<string, ContributionProgress> {
  const build = (contributedCents: MoneyCents, limitCents: MoneyCents): ContributionProgress => {
    const remainingCents = Math.max(0, limitCents - contributedCents);
    const pctOfLimit = limitCents > 0 ? contributedCents / limitCents : 0;
    return { contributedCents, limitCents, remainingCents, pctOfLimit };
  };

  return {
    traditional401k: build(
      accounts.traditional401k.taxYearContributions,
      IRS_LIMITS_2026.employee401kDeferral,
    ),
    rothIra: build(accounts.rothIra.taxYearContributions, IRS_LIMITS_2026.iraContribution),
  };
}


export function monthKeyFromIsoDate(isoDate: IsoDate): string {
  return isoDate.slice(0, 7);
}

export function addMonthsToIsoDate(isoDate: IsoDate, months: number): IsoDate {
  const [yearStr, monthStr, dayStr] = isoDate.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const target = new Date(Date.UTC(year, month - 1 + months, day));
  const y = target.getUTCFullYear();
  const m = String(target.getUTCMonth() + 1).padStart(2, '0');
  const d = String(target.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}` as IsoDate;
}

export function monthKeyAdd(monthKey: string, offset: number): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const target = new Date(Date.UTC(year, month - 1 + offset, 1));
  const y = target.getUTCFullYear();
  const m = String(target.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function buildAuditSnapshot(input: {
  asOf: IsoDate;
  startAccounts: Accounts;
  startDebts: Debts;
  endAccounts: Accounts;
  endDebts: Debts;
  transactions: LedgerTransaction[];
  periodMonths?: number;
}): AuditSnapshot {
  const startNetWorth = netWorth(input.startAccounts, input.startDebts);
  const endNetWorth = netWorth(input.endAccounts, input.endDebts);
  const months = input.periodMonths ?? 6;

  const metricBreakdown = buildMetricBreakdownSnapshot({
    transactions: input.transactions,
    accounts: input.endAccounts,
    periodMonths: months,
  });

  return {
    asOf: input.asOf,
    startNetWorth,
    netWorth: endNetWorth,
    netWorthDelta: endNetWorth - startNetWorth,
    waterfall: buildWaterfallFromTransactions(input.transactions),
    periodNetPayCents: computePeriodNetPay(input.transactions),
    savingsRate: computeSavingsRate(input.transactions),
    emergencyRunwayMonths: metricBreakdown.emergencyRunway.months,
    contributionProgress: buildContributionProgress(input.endAccounts),
    accountInvestmentReturns: computeAccountInvestmentReturns(input.transactions),
    metricBreakdown,
  };
}

export function tickSixMonths(input: SixMonthTickInput): SixMonthTickResult {
  const startAccounts = cloneAccounts(input.accounts);
  const startDebts = cloneDebts(input.debts);
  let accounts = cloneAccounts(input.accounts);
  let debts = cloneDebts(input.debts);
  const transactions: LedgerTransaction[] = [];
  const startMonthKey = monthKeyFromIsoDate(input.startDate);

  for (let i = 0; i < 6; i += 1) {
    const monthKey = monthKeyAdd(startMonthKey, i);
    const tick = applyMonthlyTick({
      monthKey,
      accounts,
      debts,
      career: input.career,
      location: input.location,
      household: input.household,
      player: input.player,
      deferral401kRate: input.deferral401kRate,
    });
    accounts = tick.accounts;
    debts = tick.debts;
    transactions.push(...tick.transactions);
  }

  const endDate = addMonthsToIsoDate(input.startDate, 6);
  const audit = buildAuditSnapshot({
    asOf: endDate,
    startAccounts,
    startDebts,
    endAccounts: accounts,
    endDebts: debts,
    transactions,
    periodMonths: 6,
  });

  return {
    startDate: input.startDate,
    endDate,
    accounts,
    debts,
    transactions,
    audit,
  };
}

/** Pretty-printed JSON for CLI inspection and golden fixtures. */
export function exportAuditJson(audit: AuditSnapshot): string {
  return JSON.stringify(audit, null, 2);
}

/** Verify waterfall lines reconcile to net worth delta (within integer rounding). */
export function waterfallReconciles(audit: AuditSnapshot): boolean {
  const waterfallSum = audit.waterfall.reduce((sum, line) => sum + line.amount, 0);
  return waterfallSum === audit.netWorthDelta;
}

/** Apply transactions in order and assert each step preserves invariant 1. */
export function replayTransactionsNetWorthDelta(
  startAccounts: Accounts,
  startDebts: Debts,
  transactions: LedgerTransaction[],
): MoneyCents {
  let accounts = cloneAccounts(startAccounts);
  let debts = cloneDebts(startDebts);
  const start = netWorth(accounts, debts);

  for (const tx of transactions) {
    applySingleTransaction(accounts, debts, tx);
  }

  return netWorth(accounts, debts) - start;
}
