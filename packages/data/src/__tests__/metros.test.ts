import { describe, expect, it } from 'vitest';
import {
  getMetroRentMultiplier,
  listMetroRentAnchors,
  METRO_RENT_ANCHORS,
} from '../calibration/housing/metros.js';
import { metroIdForState, sampleMarketRentMonthly } from '../calibration/housing/col-tiers.js';

describe('metro rent anchors', () => {
  it('documents 25 top-GDP metros', () => {
    expect(METRO_RENT_ANCHORS).toHaveLength(25);
    expect(listMetroRentAnchors()).toHaveLength(25);
  });

  it('uses monthly USD anchors (not thousands index)', () => {
    const nyc = METRO_RENT_ANCHORS.find((metro) => metro.metroId === 'new_york_city');
    expect(nyc?.zoriMonthlyUsd).toBe(2442.5);
    const la = METRO_RENT_ANCHORS.find((metro) => metro.metroId === 'los_angeles');
    expect(la?.zoriMonthlyUsd).toBe(1354.7);
  });

  it('uses COL tier bands for player-facing CA rents', () => {
    const caRent = sampleMarketRentMonthly('CA', 'metro-seed');
    expect(getMetroRentMultiplier('los_angeles')).toBeLessThan(1);
    expect(metroIdForState('CA')).toBe('los_angeles');
    expect(caRent).toBeGreaterThanOrEqual(220_000);
    expect(caRent).toBeLessThanOrEqual(432_000);
    const txRent = sampleMarketRentMonthly('TX', 'metro-seed');
    expect(caRent).not.toBe(txRent);
  });
});
