import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Accounts } from '@fad/shared';
import { describe, expect, it } from 'vitest';
import {
  computeEmergencyRunwayBreakdown,
  computeHousingBurdenBreakdown,
  computePeriod401kDeferrals,
  computePeriodNetPay,
  computeSavingsInflows,
  computeSavingsRate,
  computeSavingsRateBreakdown,
  tickSixMonths,
  buildContributionProgress,
} from '../index.js';
import { IRS_LIMITS_2026 } from '@fad/data';
import { buildPayrollFromCareer } from '../payroll.js';
import type { SixMonthTickInput } from '../audit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type SixMonthAuditFixture = {
  input: SixMonthTickInput;
  expected: {
    audit: {
      savingsRate: number;
      periodNetPayCents: number;
    };
  };
};

describe('briefing metrics', () => {
  it('computes savings rate as savings inflows over net pay', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const netPay = computePeriodNetPay(result.transactions);
    const savingsInflows = computeSavingsInflows(result.transactions);

    expect(netPay).toBe(fixture.expected.audit.periodNetPayCents);
    expect(savingsInflows).toBe(225_000);
    expect(computeSavingsRate(result.transactions)).toBeCloseTo(
      fixture.expected.audit.savingsRate,
      10,
    );
    expect(result.audit.savingsRate).toBeCloseTo(savingsInflows / netPay, 10);
  });

  it('excludes investment returns from savings inflows', () => {
    const accounts: Accounts = {
      checking: { id: 'checking', balance: 2_000_00 },
      hysa: { id: 'hysa', balance: 1_000_00 },
      brokerage: { id: 'brokerage', balance: 2_500_00 },
      rothIra: { id: 'roth', balance: 12_000_00, taxYearContributions: 0 },
      traditional401k: { id: '401k', balance: 5_000_00, taxYearContributions: 0 },
    };

    const payroll = buildPayrollFromCareer('2026-01', 120_000_00, accounts, 0.06);
    const investmentReturn = {
      id: 'tx-2026-01-return-rothIra',
      description: 'Investment return (rothIra)',
      source: 'investment_return' as const,
      lines: [
        { accountId: 'rothIra' as const, debitCents: 50_000, creditCents: 0 },
        { accountId: 'income:investmentGain' as const, debitCents: 0, creditCents: 50_000 },
      ],
    };

    const transactions = [payroll, investmentReturn];
    const deferrals = computePeriod401kDeferrals(transactions);

    expect(computeSavingsInflows(transactions)).toBe(deferrals);
    expect(computeSavingsRate(transactions)).toBeCloseTo(deferrals / computePeriodNetPay(transactions), 5);
  });

  it('savings rate breakdown lines reconcile to numerator and denominator', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const breakdown = computeSavingsRateBreakdown(result.transactions);

    expect(breakdown.rate).toBeCloseTo(result.audit.savingsRate, 10);
    expect(breakdown.savingsInflowsCents).toBe(breakdown.periodNetPayCents * breakdown.rate);
    const numeratorLine = breakdown.lines.find((line) => line.label.includes('numerator'));
    expect(numeratorLine?.amountCents).toBe(breakdown.savingsInflowsCents);
  });

  it('housing burden uses monthly rent share over monthly net pay', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const breakdown = computeHousingBurdenBreakdown(result.transactions, 6);

    expect(breakdown.monthlyRentShareCents).toBe(
      breakdown.periodRentShareCents / 6,
    );
    expect(breakdown.rate).toBeCloseTo(
      breakdown.monthlyRentShareCents / breakdown.monthlyNetPayCents,
      10,
    );
  });

  it('runway burn components use positive cost amounts', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const breakdown = computeEmergencyRunwayBreakdown({
      checkingBalanceCents: result.accounts.checking.balance,
      transactions: result.transactions,
      periodMonths: 6,
    });

    expect(breakdown.burnComponents.every((line) => line.amountCents > 0)).toBe(true);
    expect(breakdown.months).toBeCloseTo(result.audit.emergencyRunwayMonths, 10);
  });

  it('contribution progress uses IRS 2026 limits from calibration', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const progress = buildContributionProgress(result.accounts);

    expect(progress.traditional401k?.limitCents).toBe(IRS_LIMITS_2026.employee401kDeferral);
    expect(progress.rothIra?.limitCents).toBe(IRS_LIMITS_2026.iraContribution);
    expect(result.audit.metricBreakdown?.savingsRate.rate).toBeCloseTo(result.audit.savingsRate, 10);
  });
});
