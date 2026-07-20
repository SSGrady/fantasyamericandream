import { describe, expect, it } from 'vitest';
import {
  buildLivingExpenseTransactions,
  computeGroceriesMonthlyCents,
  computeMonthlyLivingExpenses,
} from '../living-expenses.js';

describe('living expenses', () => {
  it('computes Payday Playbook baseline for solo W2 with competent cooking', () => {
    const amounts = computeMonthlyLivingExpenses({
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      housingArrangement: 'solo',
      cookingSkill: 2,
      deliveryFrequency: 'low',
      includeEmployerHealthPlan: true,
    });

    expect(amounts.healthInsurance).toBe(14_000);
    expect(amounts.utilities).toBe(18_500);
    expect(amounts.groceries).toBe(53_550);
    expect(amounts.subscriptions).toBe(20_500);
  });

  it('applies cooking and delivery modifiers to groceries', () => {
    expect(
      computeGroceriesMonthlyCents({ cookingSkill: 3, deliveryFrequency: 'none' }),
    ).toBe(42_000);
    expect(
      computeGroceriesMonthlyCents({ cookingSkill: 0, deliveryFrequency: 'high' }),
    ).toBe(121_500);
  });

  it('splits utilities by housing arrangement', () => {
    const amounts = computeMonthlyLivingExpenses({
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      housingArrangement: 'roommate_1',
    });

    expect(amounts.utilities).toBe(9_250);
  });

  it('skips health insurance when employer plan is off', () => {
    const amounts = computeMonthlyLivingExpenses({
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      includeEmployerHealthPlan: false,
    });

    expect(amounts.healthInsurance).toBe(0);
  });

  it('skips living expenses when not W2 employed', () => {
    const transactions = buildLivingExpenseTransactions('2026-01', {
      career: { employmentType: 'unemployed', baseSalaryAnnual: 0 },
    });

    expect(transactions).toHaveLength(0);
  });

  it('posts balanced expense transactions to checking', () => {
    const transactions = buildLivingExpenseTransactions('2026-01', {
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      housingArrangement: 'solo',
      cookingSkill: 1,
      deliveryFrequency: 'low',
    });

    expect(transactions).toHaveLength(4);
    for (const tx of transactions) {
      const debits = tx.lines.reduce((sum, line) => sum + line.debitCents, 0);
      const credits = tx.lines.reduce((sum, line) => sum + line.creditCents, 0);
      expect(debits).toBe(credits);
      expect(tx.source).toBe('expense');
    }
  });
});
