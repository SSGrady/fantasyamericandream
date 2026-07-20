import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { AuditSnapshot } from '@fad/shared';
import {
  assertInvariants,
  exportAuditJson,
  netWorth,
  replayTransactionsNetWorthDelta,
  tickSixMonths,
  validateInvariants,
  waterfallReconciles,
} from '../index.js';
import type { SixMonthTickInput } from '../audit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type SixMonthAuditFixture = {
  description: string;
  input: SixMonthTickInput;
  expected: {
    endDate: string;
    transactionCount: number;
    startNetWorth: number;
    audit: AuditSnapshot;
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

describe('tickSixMonths', () => {
  it('runs six monthly ticks and produces audit snapshot', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const startNetWorth = netWorth(fixture.input.accounts, fixture.input.debts);
    expect(startNetWorth).toBe(fixture.expected.startNetWorth);

    const result = tickSixMonths(fixture.input);

    expect(result.endDate).toBe(fixture.expected.endDate);
    expect(result.transactions).toHaveLength(fixture.expected.transactionCount);
    expect(result.audit.asOf).toBe(fixture.expected.audit.asOf);
    expect(result.audit.netWorth).toBe(fixture.expected.netWorth);
    expect(result.audit.netWorthDelta).toBe(fixture.expected.audit.netWorthDelta);
    expect(result.audit.waterfall).toEqual(fixture.expected.audit.waterfall);
    expect(result.audit.contributionProgress).toEqual(fixture.expected.audit.contributionProgress);
    expect(result.audit.savingsRate).toBeCloseTo(fixture.expected.audit.savingsRate, 10);
    expect(result.audit.emergencyRunwayMonths).toBeCloseTo(
      fixture.expected.audit.emergencyRunwayMonths,
      10,
    );

    expect(waterfallReconciles(result.audit)).toBe(true);
    expect(
      replayTransactionsNetWorthDelta(
        fixture.input.accounts,
        fixture.input.debts,
        result.transactions,
      ),
    ).toBe(result.audit.netWorthDelta);

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

    for (const tx of result.transactions) {
      assertInvariants(fixture.input.accounts, fixture.input.debts, [tx]);
    }
    expect(validateInvariants(result.accounts, result.debts, result.transactions)).toHaveLength(0);
  });

  it('exports audit JSON suitable for CLI inspection', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/six-month-audit-jan-jun.json'), 'utf8'),
    ) as SixMonthAuditFixture;

    const result = tickSixMonths(fixture.input);
    const json = exportAuditJson(result.audit);
    const parsed = JSON.parse(json) as AuditSnapshot;

    expect(parsed).toEqual(result.audit);
    expect(json).toContain('"netWorth"');
    expect(json).toContain('"contributionProgress"');
    expect(json).toContain('"waterfall"');
  });
});
