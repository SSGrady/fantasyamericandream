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
import { applyMonthlyTick, type MonthlyTickInput } from './monthly-tick.js';
import { computePeriodNetPay, computeSavingsRate } from './metrics.js';
import { netWorth } from './net-worth.js';

export interface SixMonthTickInput {
  startDate: IsoDate;
  accounts: Accounts;
  debts: Debts;
  career: MonthlyTickInput['career'];
  location: MonthlyTickInput['location'];
  household?: MonthlyTickInput['household'];
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

const ASSET_IDS = new Set(['checking', 'hysa', 'brokerage', 'rothIra', 'traditional401k']);

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

function waterfallKey(tx: LedgerTransaction): { label: string; category: NetWorthWaterfallLine['category'] } {
  if (tx.source === 'income') {
    return { label: 'W2 payroll (net + deferrals)', category: 'income' };
  }
  if (tx.id.includes('-rent')) {
    return { label: 'Rent', category: 'expense' };
  }
  if (tx.source === 'interest_expense') {
    return { label: 'Credit card interest', category: 'expense' };
  }
  return { label: tx.description, category: 'other' };
}

function waterfallEntriesForTransaction(
  tx: LedgerTransaction,
): Array<{ label: string; category: NetWorthWaterfallLine['category']; amount: MoneyCents }> {
  if (tx.source === 'debt_payment') {
    const interest = tx.lines
      .filter((line) => line.accountId === 'expense:studentLoanInterest')
      .reduce((sum, line) => sum + line.debitCents, 0);
    if (interest > 0) {
      return [{ label: 'Student loan interest', category: 'expense', amount: -interest }];
    }
    return [];
  }

  const delta = transactionNetWorthDelta(tx);
  if (delta === 0) {
    return [];
  }

  const { label, category } = waterfallKey(tx);
  return [{ label, category, amount: delta }];
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
    return a.label.localeCompare(b.label);
  });
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

function sumNominalDebits(transactions: LedgerTransaction[], accountId: string): MoneyCents {
  return transactions.reduce((sum, tx) => {
    const lineSum = tx.lines
      .filter((line) => line.accountId === accountId)
      .reduce((lineTotal, line) => lineTotal + line.debitCents, 0);
    return sum + lineSum;
  }, 0);
}


function computeEmergencyRunwayMonths(
  accounts: Accounts,
  transactions: LedgerTransaction[],
  months: number,
): number {
  const rent = sumNominalDebits(transactions, 'expense:rent');
  const withholding = sumNominalDebits(transactions, 'expense:federalWithholding');
  const fica = sumNominalDebits(transactions, 'expense:fica');
  const ccInterest = sumNominalDebits(transactions, 'expense:creditCardInterest');
  const slInterest = sumNominalDebits(transactions, 'expense:studentLoanInterest');
  const slPrincipal = transactions
    .filter((tx) => tx.source === 'debt_payment')
    .reduce((sum, tx) => {
      const principal = tx.lines
        .filter((line) => line.accountId.startsWith('studentLoan:'))
        .reduce((lineTotal, line) => lineTotal + line.debitCents, 0);
      return sum + principal;
    }, 0);

  const monthlyBurn = (rent + withholding + fica + ccInterest + slInterest + slPrincipal) / months;
  if (monthlyBurn <= 0) {
    return Infinity;
  }
  return accounts.checking.balance / monthlyBurn;
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

  return {
    asOf: input.asOf,
    netWorth: endNetWorth,
    netWorthDelta: endNetWorth - startNetWorth,
    waterfall: buildWaterfallFromTransactions(input.transactions),
    periodNetPayCents: computePeriodNetPay(input.transactions),
    savingsRate: computeSavingsRate(input.transactions),
    emergencyRunwayMonths: computeEmergencyRunwayMonths(input.endAccounts, input.transactions, months),
    contributionProgress: buildContributionProgress(input.endAccounts),
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
