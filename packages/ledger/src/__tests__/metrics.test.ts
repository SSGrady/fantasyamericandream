import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  computePeriodNetPay,
  computeSavingsInflows,
  computeSavingsRate,
  tickSixMonths,
} from '../index.js';
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
});
