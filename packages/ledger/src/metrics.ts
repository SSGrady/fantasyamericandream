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

const TRANSFER_SAVINGS_ACCOUNT_IDS = ['hysa', 'brokerage', 'rothIra', 'hsa', 'traditional401k'] as const;

function accountDebitTotal(transactions: LedgerTransaction[], accountId: string): MoneyCents {
  return transactions.reduce((sum, tx) => {
    const lineSum = tx.lines
      .filter((line) => line.accountId === accountId)
      .reduce((lineTotal, line) => lineTotal + line.debitCents, 0);
    return sum + lineSum;
  }, 0);
}

function savingsInflowFromTransaction(tx: LedgerTransaction): MoneyCents {
  if (tx.source === 'investment_return') {
    return 0;
  }

  if (tx.source === 'income') {
    return tx.lines
      .filter((line) => line.accountId === 'traditional401k')
      .reduce((sum, line) => sum + line.debitCents, 0);
  }

  if (tx.source === 'transfer') {
    return tx.lines
      .filter((line) =>
        (TRANSFER_SAVINGS_ACCOUNT_IDS as readonly string[]).includes(line.accountId),
      )
      .reduce((sum, line) => sum + line.debitCents, 0);
  }

  return 0;
}

/** Intentional savings deposits over the audit period (excludes investment returns). */
export function computeSavingsInflows(transactions: LedgerTransaction[]): MoneyCents {
  return transactions.reduce((sum, tx) => sum + savingsInflowFromTransaction(tx), 0);
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

/** 401(k) deferrals posted from payroll over the audit period. */
export function computePeriod401kDeferrals(transactions: LedgerTransaction[]): MoneyCents {
  return accountDebitTotal(
    transactions.filter((tx) => tx.source === 'income'),
    'traditional401k',
  );
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

export interface MetricBreakdownLine {
  label: string;
  amountCents: MoneyCents;
}

export interface SavingsRateBreakdown {
  savingsInflowsCents: MoneyCents;
  periodNetPayCents: MoneyCents;
  rate: number;
  formula: string;
  lines: MetricBreakdownLine[];
}

export interface HousingBurdenBreakdown {
  periodRentShareCents: MoneyCents;
  periodNetPayCents: MoneyCents;
  monthlyRentShareCents: MoneyCents;
  monthlyNetPayCents: MoneyCents;
  rate: number;
  formula: string;
  lines: MetricBreakdownLine[];
}

export interface EmergencyRunwayBreakdown {
  checkingBalanceCents: MoneyCents;
  monthlyBurnCents: MoneyCents;
  months: number;
  formula: string;
  burnComponents: MetricBreakdownLine[];
}

export function computeSavingsRateBreakdown(
  transactions: LedgerTransaction[],
): SavingsRateBreakdown {
  const periodNetPayCents = computePeriodNetPay(transactions);
  const savingsInflowsCents = computeSavingsInflows(transactions);
  const deferrals = computePeriod401kDeferrals(transactions);
  const transferInflows = Math.max(0, savingsInflowsCents - deferrals);

  const lines: MetricBreakdownLine[] = [
    { label: 'Net pay to checking (denominator)', amountCents: periodNetPayCents },
  ];
  if (deferrals > 0) {
    lines.push({ label: '401(k) payroll deferrals', amountCents: deferrals });
  }
  if (transferInflows > 0) {
    lines.push({ label: 'Transfers to savings accounts', amountCents: transferInflows });
  }
  if (savingsInflowsCents > 0) {
    lines.push({ label: 'Total savings inflows (numerator)', amountCents: savingsInflowsCents });
  }

  return {
    savingsInflowsCents,
    periodNetPayCents,
    rate: periodNetPayCents > 0 ? savingsInflowsCents / periodNetPayCents : 0,
    formula:
      'Sum of payroll 401(k) deferrals and post-payday transfers to HYSA, brokerage, Roth, or HSA, divided by net pay deposited to checking. Investment returns are excluded.',
    lines,
  };
}

export function computeHousingBurdenBreakdown(
  transactions: LedgerTransaction[],
  periodMonths: number,
): HousingBurdenBreakdown {
  const periodNetPayCents = computePeriodNetPay(transactions);
  const periodRentShareCents = accountDebitTotal(transactions, 'expense:rent');
  const monthlyNetPayCents = periodMonths > 0 ? periodNetPayCents / periodMonths : 0;
  const monthlyRentShareCents = periodMonths > 0 ? periodRentShareCents / periodMonths : 0;

  return {
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
}

export function computeEmergencyRunwayBreakdown(input: {
  checkingBalanceCents: MoneyCents;
  transactions: LedgerTransaction[];
  periodMonths: number;
}): EmergencyRunwayBreakdown {
  const { checkingBalanceCents, transactions, periodMonths } = input;
  const months = periodMonths > 0 ? periodMonths : 1;

  const rent = accountDebitTotal(transactions, 'expense:rent');
  const childcare = accountDebitTotal(transactions, 'expense:childcare');
  const healthInsurance = accountDebitTotal(transactions, 'expense:healthInsurance');
  const utilities = accountDebitTotal(transactions, 'expense:utilities');
  const groceries = accountDebitTotal(transactions, 'expense:groceries');
  const subscriptions = accountDebitTotal(transactions, 'expense:subscriptions');
  const withholding = accountDebitTotal(transactions, 'expense:federalWithholding');
  const fica = accountDebitTotal(transactions, 'expense:fica');
  const ccInterest = accountDebitTotal(transactions, 'expense:creditCardInterest');
  const slInterest = accountDebitTotal(transactions, 'expense:studentLoanInterest');
  const slPrincipal = transactions
    .filter((tx) => tx.source === 'debt_payment')
    .reduce((sum, tx) => {
      const principal = tx.lines
        .filter((line) => line.accountId.startsWith('studentLoan:'))
        .reduce((lineTotal, line) => lineTotal + line.debitCents, 0);
      return sum + principal;
    }, 0);

  const burnComponents: MetricBreakdownLine[] = [
    { label: 'Rent (6-month total)', amountCents: rent },
    { label: 'Childcare (6-month total)', amountCents: childcare },
    { label: 'Health insurance (6-month total)', amountCents: healthInsurance },
    { label: 'Utilities (6-month total)', amountCents: utilities },
    { label: 'Groceries (6-month total)', amountCents: groceries },
    { label: 'Subscriptions (6-month total)', amountCents: subscriptions },
    { label: 'Federal withholding (6-month total)', amountCents: withholding },
    { label: 'FICA (6-month total)', amountCents: fica },
    { label: 'Credit card interest (6-month total)', amountCents: ccInterest },
    { label: 'Student loan interest (6-month total)', amountCents: slInterest },
    { label: 'Student loan principal (6-month total)', amountCents: slPrincipal },
  ].filter((line) => line.amountCents > 0);

  const periodBurn = burnComponents.reduce((sum, line) => sum + line.amountCents, 0);
  const monthlyBurnCents = periodBurn / months;
  const runwayMonths = monthlyBurnCents > 0 ? checkingBalanceCents / monthlyBurnCents : Infinity;

  return {
    checkingBalanceCents,
    monthlyBurnCents,
    months: runwayMonths,
    formula:
      'Checking balance divided by monthly essential burn from the audit period. Burn includes rent, baseline living expenses (insurance, utilities, groceries, subscriptions), childcare, payroll taxes, and debt service.',
    burnComponents,
  };
}
