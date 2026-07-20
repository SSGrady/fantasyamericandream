import { describe, expect, it } from 'vitest';
import type { Accounts, Debts, HouseholdState, MacroState } from '@fad/shared';
import { tickSixMonthsWithSimulation } from '../tick-month.js';

const accounts: Accounts = {
  checking: { id: 'checking', balance: 5_000_00 },
  hysa: { id: 'hysa', balance: 1_000_00 },
  brokerage: { id: 'brokerage', balance: 0 },
  rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
  traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
};

const debts: Debts = {
  creditCards: [],
  studentLoans: [],
};

const macro: MacroState = {
  regime: 'expansion',
  inflationAnnual: 0.025,
  sp500ReturnYtd: 0,
  mortgageRate30y: 0.065,
  layoffClimate: 1,
};

const household: HouseholdState = {
  maritalStatus: 'married',
  dependentsCount: 0,
  financeMode: 'joint',
  relationshipHealth: 75,
  partner: {
    employmentType: 'w2',
    baseSalaryAnnual: 75_000_00,
    deferral401kRate: 0.05,
  },
};

describe('tickSixMonthsWithSimulation dual income', () => {
  it('is deterministic with partner payroll', () => {
    const input = {
      startDate: '2026-01-01' as const,
      randomSeed: 'dual-income-test',
      accounts,
      debts,
      career: {
        sector: 'tech' as const,
        title: 'Engineer',
        employmentType: 'w2' as const,
        baseSalaryAnnual: 120_000_00,
        tenureMonths: 0,
        unemploymentWeeks: 0,
      },
      location: {
        stateCode: 'CA' as const,
        metroId: 'los_angeles',
        housingMode: 'rent' as const,
        rentPaymentMonthly: 2_500_00,
      },
      household,
      macro,
      deferral401kRate: 0.06,
    };

    const first = tickSixMonthsWithSimulation(input);
    const second = tickSixMonthsWithSimulation(input);

    expect(first.audit.netWorth).toBe(second.audit.netWorth);
    expect(first.transactions.filter((tx) => tx.id.includes('payroll-partner'))).toHaveLength(6);
  });
});
