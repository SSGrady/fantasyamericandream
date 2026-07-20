import { buildV0ScenarioFixture } from '@fad/data';
import { computePeriod401kDeferrals, computePeriodNetPay } from '@fad/ledger';
import { describe, expect, it } from 'vitest';
import { createMacroState, tickSixMonthsWithSimulation } from '../index.js';

describe('CA tech briefing metrics', () => {
  it('six-month audit savings rate stays near deferral rate, not market gains', () => {
    const fixture = buildV0ScenarioFixture({
      id: 'tech_ca',
      career: 'tech',
      stateCode: 'CA',
      randomSeed: 'metrics-tech-ca',
    });

    const accounts = {
      ...fixture.accounts,
      checking: { id: 'checking', balance: 2_000_00 },
      brokerage: { id: 'brokerage', balance: 2_500_00 },
      rothIra: { id: 'roth', balance: 12_000_00, taxYearContributions: 0 },
      traditional401k: { id: '401k', balance: 5_000_00, taxYearContributions: 0 },
    };

    const result = tickSixMonthsWithSimulation({
      startDate: fixture.startDate,
      randomSeed: fixture.config.randomSeed,
      accounts,
      debts: fixture.debts,
      career: fixture.career,
      location: fixture.location,
      macro: createMacroState('expansion'),
      deferral401kRate: fixture.deferral401kRate,
    });

    const netPay = computePeriodNetPay(result.transactions);
    const deferrals = computePeriod401kDeferrals(result.transactions);

    expect(result.audit.savingsRate).toBeGreaterThanOrEqual(0.08);
    expect(result.audit.savingsRate).toBeLessThanOrEqual(0.12);
    expect(result.audit.savingsRate).toBeCloseTo(deferrals / netPay, 5);
  });
});
