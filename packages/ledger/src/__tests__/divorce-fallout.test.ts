import { describe, expect, it } from 'vitest';
import { computeDivorceFallout, householdEligibleForDivorce } from '../divorce-fallout.js';

describe('divorce fallout stub', () => {
  it('splits assets and sets alimony band by severity', () => {
    const moderate = computeDivorceFallout({
      monthKey: '2026-06',
      severityId: 'moderate',
      jointLiquidAssetsCents: 40_000_00,
    });
    expect(moderate.playerAssetShareCents).toBe(20_000_00);
    expect(moderate.alimonyMonthlyCents).toBe(800_00);
    expect(moderate.transactions).toHaveLength(2);

    const contested = computeDivorceFallout({
      monthKey: '2026-06',
      severityId: 'contested',
      jointLiquidAssetsCents: 40_000_00,
    });
    expect(contested.playerAssetShareCents).toBe(18_000_00);
    expect(contested.alimonyMonthlyCents).toBe(1_500_00);
  });

  it('requires partnered or married household', () => {
    expect(
      householdEligibleForDivorce({
        maritalStatus: 'married',
        dependentsCount: 0,
        financeMode: 'joint',
        relationshipHealth: 30,
      }),
    ).toBe(true);
    expect(
      householdEligibleForDivorce({
        maritalStatus: 'single',
        dependentsCount: 0,
        financeMode: 'individual',
        relationshipHealth: 30,
      }),
    ).toBe(false);
  });
});
