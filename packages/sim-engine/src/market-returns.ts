import type { Accounts, AssetAccountId, LedgerTransaction, MacroRegime } from '@fad/shared';
import { REGIME_DEFINITIONS } from './macro-regimes.js';
import { randomNormal } from './rng.js';

const INVESTMENT_ACCOUNTS: AssetAccountId[] = ['brokerage', 'traditional401k', 'rothIra'];

export function sampleMonthlyReturn(regime: MacroRegime, rng: () => number): number {
  const def = REGIME_DEFINITIONS[regime];
  const monthlyMean = def.annualReturnMean / 12;
  const monthlyStd = def.annualReturnStdDev / Math.sqrt(12);
  return monthlyMean + monthlyStd * randomNormal(rng);
}

export function buildInvestmentReturnTransactions(
  monthKey: string,
  accounts: Accounts,
  monthlyReturn: number,
): LedgerTransaction[] {
  const transactions: LedgerTransaction[] = [];

  for (const accountId of INVESTMENT_ACCOUNTS) {
    const balance = accounts[accountId].balance;
    if (balance <= 0) {
      continue;
    }

    let gain = Math.round(balance * monthlyReturn);
    if (gain === 0) {
      continue;
    }
    if (gain < 0 && -gain > balance) {
      gain = -balance;
    }

    if (gain > 0) {
      transactions.push({
        id: `tx-${monthKey}-return-${accountId}`,
        description: `Investment return (${accountId})`,
        source: 'investment_return',
        lines: [
          { accountId, debitCents: gain, creditCents: 0 },
          { accountId: 'income:investmentGain', debitCents: 0, creditCents: gain },
        ],
      });
      continue;
    }

    const loss = -gain;
    transactions.push({
      id: `tx-${monthKey}-return-${accountId}`,
      description: `Investment return (${accountId})`,
      source: 'investment_return',
      lines: [
        { accountId, debitCents: 0, creditCents: loss },
        { accountId: 'expense:investmentLoss', debitCents: loss, creditCents: 0 },
      ],
    });
  }

  return transactions.sort((a, b) => a.id.localeCompare(b.id));
}
