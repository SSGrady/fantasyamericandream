import type { MoneyCents, UsStateCode } from '@fad/shared';
import { getMetroRentAnchor } from './metros.js';

export type ColTier = 'VHCOL' | 'HCOL' | 'MCOL' | 'LCOL';

export interface ColTierRentBand {
  tier: ColTier;
  minMonthlyCents: MoneyCents;
  maxMonthlyCents: MoneyCents;
}

/** Monthly rent bands by COL tier (player-facing calibration-2026). */
export const COL_TIER_RENT_BANDS: Record<ColTier, ColTierRentBand> = {
  VHCOL: { tier: 'VHCOL', minMonthlyCents: 220_000, maxMonthlyCents: 320_000 },
  HCOL: { tier: 'HCOL', minMonthlyCents: 160_000, maxMonthlyCents: 240_000 },
  MCOL: { tier: 'MCOL', minMonthlyCents: 120_000, maxMonthlyCents: 180_000 },
  LCOL: { tier: 'LCOL', minMonthlyCents: 90_000, maxMonthlyCents: 150_000 },
};

/** V0 state set mapped to COL tier. */
export const STATE_COL_TIER: Record<UsStateCode, ColTier> = {
  CA: 'VHCOL',
  NY: 'VHCOL',
  WA: 'HCOL',
  IL: 'HCOL',
  TX: 'MCOL',
  NC: 'MCOL',
  GA: 'MCOL',
  FL: 'LCOL',
  TN: 'LCOL',
  SC: 'LCOL',
};

const STATE_METRO_IDS: Record<UsStateCode, string> = {
  CA: 'los_angeles',
  FL: 'miami',
  NY: 'new_york_city',
  TX: 'austin',
  WA: 'seattle',
  NC: 'charlotte',
  TN: 'nashville',
  IL: 'chicago',
  GA: 'atlanta',
  SC: 'charleston',
};

function seededUniform(seed: string, salt: string): number {
  let state = 0;
  const input = `${seed}:${salt}`;
  for (let i = 0; i < input.length; i += 1) {
    state = (state + input.charCodeAt(i) * (i + 1)) >>> 0;
  }
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0x100000000;
}

/**
 * Player-facing market rent from COL tier bands.
 * Metro ZORI anchors inform relative pricing in rental listings, not a down-multiplier here.
 */
export function sampleMarketRentMonthly(stateCode: UsStateCode, seed: string): MoneyCents {
  const tier = STATE_COL_TIER[stateCode];
  const band = COL_TIER_RENT_BANDS[tier];
  const u = seededUniform(seed, `col-rent-${stateCode}`);
  const raw = band.minMonthlyCents + u * (band.maxMonthlyCents - band.minMonthlyCents);
  const metroId = metroIdForState(stateCode);
  const anchor = getMetroRentAnchor(metroId);
  const metroScale =
    anchor && tier === 'VHCOL'
      ? Math.min(1.35, Math.max(0.92, anchor.zoriMonthlyUsd / 1800))
      : 1;
  const adjusted = raw * metroScale;
  return Math.max(50_00, Math.round(adjusted / 25_00) * 25_00);
}

export function metroIdForState(stateCode: UsStateCode): string {
  return STATE_METRO_IDS[stateCode];
}

export function colTierForState(stateCode: UsStateCode): ColTier {
  return STATE_COL_TIER[stateCode];
}

export { getMetroRentAnchor, getMetroRentMultiplier } from './metros.js';
