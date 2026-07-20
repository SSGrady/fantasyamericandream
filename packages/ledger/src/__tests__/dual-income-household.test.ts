import { describe, expect, it } from 'vitest';
import type { Accounts, Debts, HouseholdState } from '@fad/shared';
import { computeMonthlyLivingExpenses } from '../living-expenses.js';
import { grossToNet, monthlyGrossFromAnnual } from '../payroll.js';
import {
  applyMonthlyTick,
  buildMonthlyTransactions,
  netWorth,
  tickSixMonths,
} from '../index.js';

const baseAccounts: Accounts = {
  checking: { id: 'checking', balance: 5_000_00 },
  hysa: { id: 'hysa', balance: 1_000_00 },
  brokerage: { id: 'brokerage', balance: 0 },
  rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
  traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
};

const baseDebts: Debts = {
  creditCards: [],
  studentLoans: [],
  mortgages: [],
};

const dualIncomeHousehold: HouseholdState = {
  maritalStatus: 'married',
  dependentsCount: 0,
  financeMode: 'joint',
  relationshipHealth: 75,
  partner: {
    employmentType: 'w2',
    baseSalaryAnnual: 80_000_00,
    deferral401kRate: 0.05,
  },
};

describe('dual-income household payroll', () => {
  it('posts player and partner payroll in one month', () => {
    const transactions = buildMonthlyTransactions({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: { rentPaymentMonthly: 2_000_00, housingMode: 'rent' },
      household: dualIncomeHousehold,
      deferral401kRate: 0.06,
    });

    const payrollTxs = transactions.filter((tx) => tx.source === 'income');
    expect(payrollTxs).toHaveLength(2);
    expect(payrollTxs.map((tx) => tx.id)).toEqual(
      expect.arrayContaining(['tx-2026-01-payroll', 'tx-2026-01-payroll-partner']),
    );
  });

  it('credits checking with both net pays after one tick', () => {
    const playerGross = monthlyGrossFromAnnual(120_000_00);
    const partnerGross = monthlyGrossFromAnnual(80_000_00);
    const playerNet = grossToNet({
      grossMonthlyCents: playerGross,
      requestedDeferral401kCents: Math.round(playerGross * 0.06),
      taxYear401kContributions: 0,
    }).netPayCents;
    const partnerNet = grossToNet({
      grossMonthlyCents: partnerGross,
      requestedDeferral401kCents: Math.round(partnerGross * 0.05),
      taxYear401kContributions: 0,
    }).netPayCents;

    const result = applyMonthlyTick({
      monthKey: '2026-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: { rentPaymentMonthly: 0, housingMode: 'rent' },
      household: dualIncomeHousehold,
      deferral401kRate: 0.06,
    });

    const living = computeMonthlyLivingExpenses({
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
    });
    const checkingLiving = living.healthInsurance + living.utilities;

    expect(result.accounts.checking.balance).toBe(
      baseAccounts.checking.balance + playerNet + partnerNet - checkingLiving,
    );
  });

  it('six-month tick with partner income increases net worth vs single income', () => {
    const single = tickSixMonths({
      startDate: '2026-01-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: { rentPaymentMonthly: 2_000_00, housingMode: 'rent' },
      deferral401kRate: 0.06,
    });

    const dual = tickSixMonths({
      startDate: '2026-01-01',
      accounts: baseAccounts,
      debts: baseDebts,
      career: { employmentType: 'w2', baseSalaryAnnual: 120_000_00 },
      location: { rentPaymentMonthly: 2_000_00, housingMode: 'rent' },
      household: dualIncomeHousehold,
      deferral401kRate: 0.06,
    });

    expect(netWorth(dual.accounts, dual.debts)).toBeGreaterThan(
      netWorth(single.accounts, single.debts),
    );
    expect(dual.transactions.filter((tx) => tx.id.includes('payroll-partner'))).toHaveLength(6);
  });
});
