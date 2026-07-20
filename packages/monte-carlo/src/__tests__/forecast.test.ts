import { describe, expect, it } from 'vitest';
import { comparePoliciesWithCrn, computeGoalProbability, runForecast } from '../forecast.js';

describe('runForecast', () => {
  const snapshot = {
    netWorth: 25_000_00,
    monthlySavingsCents: 800_00,
    monthlyBurnCents: 400_00,
  };

  it('returns deterministic paths for same seed', () => {
    const a = runForecast('test-seed', snapshot, { paths: 20, horizonMonths: 12 });
    const b = runForecast('test-seed', snapshot, { paths: 20, horizonMonths: 12 });
    expect(a.paths[0]?.netWorthByMonth).toEqual(b.paths[0]?.netWorthByMonth);
  });

  it('computes goal probability', () => {
    const forecast = runForecast('goal-seed', snapshot, { paths: 100, horizonMonths: 24 });
    const goal = computeGoalProbability(forecast, { goalNetWorth: 50_000_00, horizonMonths: 24 });
    expect(goal.probability).toBeGreaterThanOrEqual(0);
    expect(goal.probability).toBeLessThanOrEqual(1);
  });

  it('compares policies with CRN seeds', () => {
    const result = comparePoliciesWithCrn({
      seed: 'crn-seed',
      baselineSnapshot: snapshot,
      policySnapshot: { ...snapshot, monthlySavingsCents: 1_200_00 },
      paths: 50,
      horizonMonths: 12,
    });
    expect(result.deltaMedianFinal).not.toBe(0);
  });
});
