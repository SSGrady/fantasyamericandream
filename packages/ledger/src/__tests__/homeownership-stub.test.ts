import { describe, expect, it } from 'vitest';
import type { Accounts, Debts } from '@fad/shared';
import { applyMonthlyTick } from '../monthly-tick.js';
import { computeMortgagePitiStub } from '../mortgage.js';

describe('homeownership stub', () => {
  it('posts PITI instead of rent when housingMode is own', () => {
    const homeValue = 500_000_00;
    const stub = computeMortgagePitiStub({ homeValueCents: homeValue, downPaymentPct: 0.15 });

    const accounts: Accounts = {
      checking: { id: 'checking', balance: 20_000_00 },
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
      mortgages: [
        {
          id: 'mtg1',
          principal: stub.principal,
          homeValue,
          apr: 0.0655,
          termMonths: 360,
          monthlyPiti: stub.monthlyPiti,
          pmiMonthly: stub.pmiMonthly,
        },
      ],
    };

    const result = applyMonthlyTick({
      monthKey: '2026-01',
      accounts,
      debts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: {
        rentPaymentMonthly: 0,
        housingMode: 'own',
        homeValueCents: homeValue,
      },
      player: {
        habits: { deliveryFrequency: 'low', cookingSkill: 1, subscriptionLoad: 0 },
        includeEmployerHealthPlan: false,
      },
    });

    expect(result.transactions.some((tx) => tx.id.includes('mortgage-piti'))).toBe(true);
    expect(result.transactions.some((tx) => tx.id.includes('-rent'))).toBe(false);
    expect(stub.pmiMonthly).toBeGreaterThan(0);
  });
});
