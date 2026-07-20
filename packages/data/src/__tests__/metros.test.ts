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

  it('applies metro multiplier in market rent sampling', () => {
    const caRent = sampleMarketRentMonthly('CA', 'metro-seed');
    const txRent = sampleMarketRentMonthly('TX', 'metro-seed');
    expect(getMetroRentMultiplier('los_angeles')).toBeLessThan(1);
    expect(metroIdForState('CA')).toBe('los_angeles');
    expect(caRent).toBeGreaterThan(50_00);
    expect(caRent).not.toBe(txRent);
  });
});
