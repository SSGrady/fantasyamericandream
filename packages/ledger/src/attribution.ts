import type {
  LedgerTransaction,
  MoneyCents,
  NetWorthAttribution,
  NetWorthWaterfallLine,
} from '@fad/shared';
import {
  computeAccountInvestmentReturns,
  buildWaterfallFromTransactions,
} from './audit.js';
import { computeSavingsInflows } from './metrics.js';

const LIFESTYLE_EXPENSE_LABELS = new Set([
  'Rent',
  'Health insurance',
  'Utilities',
  'Groceries',
  'Subscriptions',
  'Childcare',
  'Credit card interest',
  'Student loan interest',
  'Mortgage PITI',
]);

function sumWaterfallCategory(
  waterfall: NetWorthWaterfallLine[],
  category: NetWorthWaterfallLine['category'],
): MoneyCents {
  return waterfall
    .filter((line) => line.category === category)
    .reduce((sum, line) => sum + line.amount, 0);
}

function sumLifestyleLeakage(waterfall: NetWorthWaterfallLine[]): MoneyCents {
  return waterfall
    .filter((line) => line.category === 'expense' && LIFESTYLE_EXPENSE_LABELS.has(line.label))
    .reduce((sum, line) => sum + Math.abs(line.amount), 0);
}

function sumDebtPrincipal(transactions: LedgerTransaction[]): MoneyCents {
  return transactions
    .filter((tx) => tx.source === 'debt_payment')
    .reduce((sum, tx) => {
      const principal = tx.lines
        .filter((line) => line.accountId.startsWith('studentLoan:'))
        .reduce((lineTotal, line) => lineTotal + line.debitCents, 0);
      return sum + principal;
    }, 0);
}

/** Net-worth change attribution for audit and narrative consumption. */
export function buildNetWorthAttribution(input: {
  netWorthDelta: MoneyCents;
  transactions: LedgerTransaction[];
  waterfall?: NetWorthWaterfallLine[];
}): NetWorthAttribution {
  const waterfall = input.waterfall ?? buildWaterfallFromTransactions(input.transactions);
  const contributionCents = computeSavingsInflows(input.transactions);
  const accountReturns = computeAccountInvestmentReturns(input.transactions);
  const returnCents = Object.values(accountReturns).reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  const lifestyleLeakageCents =
    sumLifestyleLeakage(waterfall) + sumDebtPrincipal(input.transactions);
  const incomeBeyondSavings = sumWaterfallCategory(waterfall, 'income') - contributionCents;
  const choiceCents = contributionCents + incomeBeyondSavings;
  const luckCents = returnCents;
  const attributed =
    choiceCents + luckCents - lifestyleLeakageCents + sumWaterfallCategory(waterfall, 'other');
  const residualCents = input.netWorthDelta - attributed;

  return {
    contributionCents,
    returnCents,
    lifestyleLeakageCents,
    choiceCents,
    luckCents,
    residualCents,
    byAccount: {
      traditional401k: accountReturns.traditional401k ?? 0,
      brokerage: accountReturns.brokerage ?? 0,
      rothIra: accountReturns.rothIra ?? 0,
    },
  };
}
