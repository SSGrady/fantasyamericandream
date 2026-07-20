import { describe, expect, it } from 'vitest';
import {
  buildLivingExpenseTransactions,
  computeGroceriesMonthlyCents,
  computeMonthlyLivingExpenses,
  LIVING_EXPENSE_STUB_2026,
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
    expect(amounts.discretionary).toBe(
      LIVING_EXPENSE_STUB_2026.creditCardPlaybookMonthly -
        amounts.groceries -
        amounts.subscriptions,
    );
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

  it('posts card spend to credit card and essentials to checking', () => {
    const transactions = buildLivingExpenseTransactions('2026-01', {
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      housingArrangement: 'solo',
      cookingSkill: 1,
      deliveryFrequency: 'low',
      creditCardId: 'cc1',
    });

    expect(transactions).toHaveLength(5);
    const checkingCredits = transactions.filter((tx) =>
      tx.lines.some((line) => line.accountId === 'checking' && line.creditCents > 0),
    );
    const cardCredits = transactions.filter((tx) =>
      tx.lines.some((line) => line.accountId === 'creditCard:cc1' && line.creditCents > 0),
    );
    expect(checkingCredits).toHaveLength(2);
    expect(cardCredits).toHaveLength(3);

    for (const tx of transactions) {
      const debits = tx.lines.reduce((sum, line) => sum + line.debitCents, 0);
      const credits = tx.lines.reduce((sum, line) => sum + line.creditCents, 0);
      expect(debits).toBe(credits);
      expect(tx.source).toBe('expense');
    }
  });
});
