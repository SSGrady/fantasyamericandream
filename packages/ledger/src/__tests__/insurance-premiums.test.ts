import { describe, expect, it } from 'vitest';
import { V1_MODULE_IDS } from '@fad/shared';
import {
  applyMonthlyTick,
  buildInsurancePremiumTransactions,
  buildMonthlyTransactions,
} from '../index.js';

const baseAccounts = {
  checking: { id: 'checking', balance: 10_000_00 },
  hysa: { id: 'hysa', balance: 0 },
  brokerage: { id: 'brokerage', balance: 0 },
  rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
  traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
};

const baseDebts = {
  creditCards: [],
  studentLoans: [],
  mortgages: [],
};

describe('insurance premium stubs', () => {
  it('posts term life and disability when modules enabled', () => {
    const transactions = buildInsurancePremiumTransactions({
      monthKey: '2026-01',
      ageYears: 25,
      career: { employmentType: 'w2', baseSalaryAnnual: 100_000_00 },
      termLifeEnabled: true,
      disabilityEnabled: true,
    });

    expect(transactions).toHaveLength(2);
    expect(transactions.map((tx) => tx.id)).toEqual(
      expect.arrayContaining(['tx-2026-01-term-life', 'tx-2026-01-disability']),
    );
  });

  it('skips premiums when insurance modules are off', () => {
    const transactions = buildMonthlyTransactions({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 100_000_00 },
      location: { rentPaymentMonthly: 0, housingMode: 'rent' },
      player: { ageYears: 28, includeEmployerHealthPlan: false, habits: { cookingSkill: 1, deliveryFrequency: 'low', subscriptionLoad: 0 } },
      enabledModules: [],
    });

    expect(transactions.some((tx) => tx.id.includes('term-life'))).toBe(false);
    expect(transactions.some((tx) => tx.id.includes('disability'))).toBe(false);
  });

  it('posts premiums on monthly tick when enabled', () => {
    const result = applyMonthlyTick({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 100_000_00 },
      location: { rentPaymentMonthly: 0, housingMode: 'rent' },
      player: { ageYears: 28, includeEmployerHealthPlan: false, habits: { cookingSkill: 1, deliveryFrequency: 'low', subscriptionLoad: 0 } },
      enabledModules: [V1_MODULE_IDS.insuranceTermLife, V1_MODULE_IDS.insuranceDisability],
    });

    expect(result.transactions.some((tx) => tx.id === 'tx-2026-01-term-life')).toBe(true);
    expect(result.transactions.some((tx) => tx.id === 'tx-2026-01-disability')).toBe(true);
  });
});
