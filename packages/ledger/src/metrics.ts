import type { LedgerTransaction, MoneyCents } from '@fad/shared';

/** Savings vehicles counted in savings rate (see docs/schema/metrics-definitions.md). */
export const SAVINGS_ACCOUNT_IDS = [
  'traditional401k',
  'hysa',
  'brokerage',
  'rothIra',
  'hsa',
] as const;

export type SavingsAccountId = (typeof SAVINGS_ACCOUNT_IDS)[number];

function accountNetInflow(transactions: LedgerTransaction[], accountId: string): MoneyCents {
  return transactions.reduce((sum, tx) => {
    const lineSum = tx.lines
      .filter((line) => line.accountId === accountId)
      .reduce((lineTotal, line) => lineTotal + line.debitCents - line.creditCents, 0);
    return sum + lineSum;
  }, 0);
}

/** Net inflows to 401k, HSA, brokerage, Roth, and HYSA over the audit period. */
export function computeSavingsInflows(transactions: LedgerTransaction[]): MoneyCents {
  return SAVINGS_ACCOUNT_IDS.reduce(
    (sum, accountId) => sum + Math.max(0, accountNetInflow(transactions, accountId)),
    0,
  );
}

/** Net pay deposited to checking from W2 payroll (player + partner) over the audit period. */
export function computePeriodNetPay(transactions: LedgerTransaction[]): MoneyCents {
  return transactions
    .filter((tx) => tx.source === 'income')
    .reduce((sum, tx) => {
      const checkingNet = tx.lines
        .filter((line) => line.accountId === 'checking')
        .reduce((lineTotal, line) => lineTotal + line.debitCents - line.creditCents, 0);
      return sum + checkingNet;
    }, 0);
}

/** Intentional savings inflows divided by net pay (see docs/schema/metrics-definitions.md). */
export function computeSavingsRate(transactions: LedgerTransaction[]): number {
  const netPay = computePeriodNetPay(transactions);
  if (netPay <= 0) {
    return 0;
  }
  const savingsInflows = computeSavingsInflows(transactions);
  return Math.max(0, savingsInflows / netPay);
}
