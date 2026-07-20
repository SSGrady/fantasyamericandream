import { describe, expect, it } from 'vitest';
import {
  CHILDCARE_MONTHLY_PER_CHILD_CENTS,
  type Accounts,
  type Debts,
  type HouseholdState,
} from '@fad/shared';
import {
  applyMonthlyTick,
  assertInvariants,
  buildChildcareTransaction,
  buildMonthlyTransactions,
  tickSixMonths,
} from '../index.js';

const baseAccounts: Accounts = {
  checking: { id: 'checking', balance: 10_000_00 },
  hysa: { id: 'hysa', balance: 0 },
  brokerage: { id: 'brokerage', balance: 0 },
  rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
  traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
};

const baseDebts: Debts = {
  creditCards: [],
  studentLoans: [],
};

const householdWithDependents = (dependentsCount: number): HouseholdState => ({
  maritalStatus: 'married',
  dependentsCount,
  financeMode: 'joint',
  relationshipHealth: 75,
});

describe('childcare dependents stub', () => {
  it('does not post childcare when dependentsCount is zero', () => {
    const tx = buildChildcareTransaction('2026-01', 0);
    expect(tx).toBeNull();

    const transactions = buildMonthlyTransactions({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 100_000_00 },
      location: { rentPaymentMonthly: 0 },
      household: householdWithDependents(0),
    });

    expect(transactions.some((entry) => entry.id.includes('childcare'))).toBe(false);
  });

  it('posts childcare scaled by dependents count', () => {
    for (const count of [1, 2, 3]) {
      const tx = buildChildcareTransaction('2026-01', count);
      expect(tx).not.toBeNull();
      expect(tx?.lines).toEqual([
        {
          accountId: 'expense:childcare',
          debitCents: count * CHILDCARE_MONTHLY_PER_CHILD_CENTS,
          creditCents: 0,
        },
        {
          accountId: 'checking',
          debitCents: 0,
          creditCents: count * CHILDCARE_MONTHLY_PER_CHILD_CENTS,
        },
      ]);
    }
  });

  it('debits checking after monthly tick with dependents', () => {
    const dependentsCount = 2;
    const childcareTotal = dependentsCount * CHILDCARE_MONTHLY_PER_CHILD_CENTS;

    const result = applyMonthlyTick({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'unemployed', baseSalaryAnnual: 0 },
      location: { rentPaymentMonthly: 0 },
      household: householdWithDependents(dependentsCount),
    });

    expect(result.accounts.checking.balance).toBe(baseAccounts.checking.balance - childcareTotal);
    assertInvariants(result.accounts, result.debts, result.transactions);
  });

  it('posts childcare each month in a six-month tick', () => {
    const result = tickSixMonths({
      startDate: '2026-01-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'unemployed', baseSalaryAnnual: 0 },
      location: { rentPaymentMonthly: 0 },
      household: householdWithDependents(1),
    });

    const childcareTxs = result.transactions.filter((tx) => tx.id.includes('childcare'));
    expect(childcareTxs).toHaveLength(6);

    const childcareLine = result.audit.waterfall.find((line) => line.label === 'Childcare');
    expect(childcareLine?.amount).toBe(-6 * CHILDCARE_MONTHLY_PER_CHILD_CENTS);
  });
});
