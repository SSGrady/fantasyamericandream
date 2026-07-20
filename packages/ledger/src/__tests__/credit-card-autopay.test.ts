import { describe, expect, it } from 'vitest';
import type { Accounts, Debts } from '@fad/shared';
import { applyMonthlyTick, computeAccountInvestmentReturns, computeMonthlyLivingExpenses } from '../index.js';

describe('credit card pay in full', () => {
  const accounts: Accounts = {
    checking: { id: 'checking', balance: 10_000_00 },
    hysa: { id: 'hysa', balance: 0 },
    brokerage: { id: 'brokerage', balance: 0 },
    rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
    traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
  };

  const debts: Debts = {
    creditCards: [
      { id: 'cc1', balance: 0, limit: 5_000_00, apr: 0.2199, minimumPayment: 25_00 },
    ],
    studentLoans: [],
    mortgages: [],
  };

  it('charges playbook card spend then autopays to zero balance', () => {
    const result = applyMonthlyTick({
      monthKey: '2026-01',
      accounts,
      debts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: { rentPaymentMonthly: 0, housingMode: 'rent' },
      player: {
        habits: { deliveryFrequency: 'low', cookingSkill: 1, subscriptionLoad: 0 },
        includeEmployerHealthPlan: true,
      },
    });

    const living = computeMonthlyLivingExpenses({
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      cookingSkill: 1,
      deliveryFrequency: 'low',
    });
    const cardSpend = living.groceries + living.subscriptions + living.discretionary;

    expect(result.debts.creditCards[0]?.balance).toBe(0);
    expect(result.transactions.some((tx) => tx.id.includes('zz-cc-autopay'))).toBe(true);
    expect(cardSpend).toBe(1_039_00);
  });
});

describe('computeAccountInvestmentReturns', () => {
  it('sums roth investment returns separately from contributions', () => {
    const returns = computeAccountInvestmentReturns([
      {
        id: 'tx-2026-01-return-rothIra',
        description: 'Investment return (rothIra)',
        source: 'investment_return',
        lines: [
          { accountId: 'rothIra', debitCents: 50_000, creditCents: 0 },
          { accountId: 'income:investmentGain', debitCents: 0, creditCents: 50_000 },
        ],
      },
    ]);

    expect(returns.rothIra).toBe(50_000);
  });
});
