import { describe, expect, it } from 'vitest';
import {
  COL_TIER_RENT_BANDS,
  sampleMarketRentMonthly,
  STATE_COL_TIER,
} from '../calibration/housing/col-tiers.js';

describe('COL tier rent sampling', () => {
  it('maps V0 states to expected tiers', () => {
    expect(STATE_COL_TIER.CA).toBe('VHCOL');
    expect(STATE_COL_TIER.TX).toBe('MCOL');
    expect(STATE_COL_TIER.FL).toBe('LCOL');
  });

  it('samples rent within tier band', () => {
    const rent = sampleMarketRentMonthly('CA', 'seed-ca-tech');
    const band = COL_TIER_RENT_BANDS.VHCOL;
    expect(rent).toBeGreaterThanOrEqual(band.minMonthlyCents);
    expect(rent).toBeLessThanOrEqual(band.maxMonthlyCents);
  });

  it('is deterministic for same seed and state', () => {
    const a = sampleMarketRentMonthly('NY', 'v1-payday-playbook');
    const b = sampleMarketRentMonthly('NY', 'v1-payday-playbook');
    expect(a).toBe(b);
  });

  it('varies by state for same seed', () => {
    const ca = sampleMarketRentMonthly('CA', 'shared-seed');
    const tx = sampleMarketRentMonthly('TX', 'shared-seed');
    expect(ca).not.toBe(tx);
  });
});
