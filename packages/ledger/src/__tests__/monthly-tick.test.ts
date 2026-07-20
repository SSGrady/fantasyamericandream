import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { IRS_LIMITS_2026 } from '@fad/data';
import type { Accounts, Debts } from '@fad/shared';
import {
  applyMonthlyTick,
  assertInvariants,
  buildMonthlyTransactions,
  grossToNet,
  monthlyGrossFromAnnual,
  monthlyInterestCents,
  netWorth,
  splitStudentLoanPayment,
  validateInvariants,
} from '../index.js';
import type { MonthlyTickInput } from '../monthly-tick.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type MonthlyTickFixture = {
  description: string;
  input: MonthlyTickInput;
  expected: {
    payroll: {
      grossMonthlyCents: number;
      federalWithholdingCents: number;
      ficaSocialSecurityCents: number;
      ficaMedicareCents: number;
      deferral401kCents: number;
      netPayCents: number;
    };
    creditCardInterestCents: number;
    studentLoanPayment: {
      interestCents: number;
      principalCents: number;
      totalCents: number;
    };
    accounts: {
      checking: { balance: number };
      traditional401k: { balance: number; taxYearContributions: number };
    };
    debts: {
      creditCards: Array<{ id: string; balance: number }>;
      studentLoans: Array<{ id: string; principal: number }>;
    };
    netWorth: number;
  };
};

describe('grossToNet', () => {
  it('computes federal withholding, FICA, and net pay', () => {
    const result = grossToNet({
      grossMonthlyCents: 625_000,
      requestedDeferral401kCents: 37_500,
      taxYear401kContributions: 0,
    });

    expect(result.federalWithholdingCents).toBe(93_750);
    expect(result.ficaSocialSecurityCents).toBe(38_750);
    expect(result.ficaMedicareCents).toBe(9_063);
    expect(result.deferral401kCents).toBe(37_500);
    expect(result.netPayCents).toBe(445_937);
  });

  it('caps 401k deferral at IRS employee limit', () => {
    const nearLimit = IRS_LIMITS_2026.employee401kDeferral - 10_000;
    const result = grossToNet({
      grossMonthlyCents: 500_000,
      requestedDeferral401kCents: 500_000,
      taxYear401kContributions: nearLimit,
    });

    expect(result.deferral401kCents).toBe(10_000);
  });
});

describe('monthly debt postings', () => {
  it('accrues credit card interest monthly', () => {
    expect(monthlyInterestCents(50_000, 0.2199)).toBe(916);
  });

  it('allocates student loan payment interest first then principal', () => {
    const split = splitStudentLoanPayment({
      id: 'sl1',
      principal: 2_500_000,
      apr: 0.055,
      minimumPayment: 28_000,
    });

    expect(split.interestCents).toBe(11_458);
    expect(split.principalCents).toBe(16_542);
    expect(split.totalCents).toBe(28_000);
  });
});

describe('applyMonthlyTick golden fixture', () => {
  it('posts payroll, rent, CC interest, and student loan payment', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/monthly-tick-jan.json'), 'utf8'),
    ) as MonthlyTickFixture;

    const grossMonthly = monthlyGrossFromAnnual(fixture.input.career.baseSalaryAnnual);
    const payroll = grossToNet({
      grossMonthlyCents: grossMonthly,
      requestedDeferral401kCents: Math.round(grossMonthly * (fixture.input.deferral401kRate ?? 0.06)),
      taxYear401kContributions: fixture.input.accounts.traditional401k.taxYearContributions,
    });
    expect(payroll).toMatchObject(fixture.expected.payroll);

    const transactions = buildMonthlyTransactions(fixture.input);
    for (const tx of transactions) {
      assertInvariants(fixture.input.accounts, fixture.input.debts, [tx]);
    }

    const result = applyMonthlyTick(fixture.input);

    expect(result.accounts.checking.balance).toBe(fixture.expected.accounts.checking.balance);
    expect(result.accounts.traditional401k.balance).toBe(
      fixture.expected.accounts.traditional401k.balance,
    );
    expect(result.accounts.traditional401k.taxYearContributions).toBe(
      fixture.expected.accounts.traditional401k.taxYearContributions,
    );
    expect(result.debts.creditCards[0]?.balance).toBe(
      fixture.expected.debts.creditCards[0]?.balance,
    );
    expect(result.debts.studentLoans[0]?.principal).toBe(
      fixture.expected.debts.studentLoans[0]?.principal,
    );
    expect(netWorth(result.accounts, result.debts)).toBe(fixture.expected.netWorth);
    expect(validateInvariants(result.accounts, result.debts, result.transactions)).toHaveLength(0);
  });
});

describe('applyMonthlyTick edge cases', () => {
  const baseAccounts = (): Accounts => ({
    checking: { id: 'checking', balance: 10_000_00 },
    hysa: { id: 'hysa', balance: 0 },
    brokerage: { id: 'brokerage', balance: 0 },
    rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
    traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
  });

  const baseDebts = (): Debts => ({
    creditCards: [],
    studentLoans: [],
    mortgages: [],
  });

  it('skips payroll when not W2 employed', () => {
    const result = applyMonthlyTick({
      monthKey: '2026-02',
      accounts: baseAccounts(),
      debts: baseDebts(),
      career: { employmentType: 'unemployed', baseSalaryAnnual: 0 },
      location: { rentPaymentMonthly: 1_500_00, housingMode: 'rent' },
    });

    expect(result.transactions.some((tx) => tx.id.includes('payroll'))).toBe(false);
    expect(result.accounts.checking.balance).toBe(10_000_00 - 1_500_00);
  });
});
