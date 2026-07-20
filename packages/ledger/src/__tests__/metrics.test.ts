import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Accounts } from '@fad/shared';
import { describe, expect, it } from 'vitest';
import {
  computePeriod401kDeferrals,
  computePeriodNetPay,
  computeSavingsInflows,
  computeSavingsRate,
  tickSixMonths,
} from '../index.js';
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
});
