import { describe, expect, it } from 'vitest';
import { buildV0ScenarioFixture, V0_SCENARIO_CAREERS, V0_SCENARIO_MATRIX, V0_SCENARIO_STATES } from '@fad/data';
import { validateInvariants, waterfallReconciles } from '@fad/ledger';
import { createMacroState, tickSixMonthsWithSimulation } from '../index.js';

describe('V0 scenario matrix', () => {
  it('defines 5 careers and 8 states (40 combos)', () => {
    expect(V0_SCENARIO_CAREERS).toHaveLength(5);
    expect(V0_SCENARIO_STATES).toHaveLength(8);
    expect(V0_SCENARIO_MATRIX).toHaveLength(40);
  });

  it.each(V0_SCENARIO_MATRIX.map((scenario) => [scenario.id, scenario] as const))(
    'runs %s end-to-end with valid audit',
    (_id, scenario) => {
      const fixture = buildV0ScenarioFixture(scenario);
      const result = tickSixMonthsWithSimulation({
        startDate: fixture.startDate,
        randomSeed: fixture.config.randomSeed,
        accounts: fixture.accounts,
        debts: fixture.debts,
        career: fixture.career,
        location: fixture.location,
        macro: createMacroState('expansion'),
        deferral401kRate: fixture.deferral401kRate,
      });

      expect(result.endDate).toBe('2026-07-01');
      expect(result.transactions.length).toBeGreaterThan(0);
      expect(result.audit.asOf).toBe('2026-07-01');
      expect(Number.isInteger(result.audit.netWorth)).toBe(true);
      expect(result.audit.waterfall.length).toBeGreaterThan(0);
      expect(waterfallReconciles(result.audit)).toBe(true);
      expect(validateInvariants(result.accounts, result.debts, result.transactions)).toHaveLength(0);
    },
  );
});
