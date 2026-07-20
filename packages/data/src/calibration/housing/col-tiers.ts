import type { MoneyCents, UsStateCode } from '@fad/shared';
import { getMetroRentMultiplier } from './metros.js';

export type ColTier = 'VHCOL' | 'HCOL' | 'MCOL' | 'LCOL';

export interface ColTierRentBand {
  tier: ColTier;
  minMonthlyCents: MoneyCents;
  maxMonthlyCents: MoneyCents;
}

/** Monthly rent bands by COL tier (calibration-2026 anchors). */
export const COL_TIER_RENT_BANDS: Record<ColTier, ColTierRentBand> = {
  VHCOL: { tier: 'VHCOL', minMonthlyCents: 220_000, maxMonthlyCents: 320_000 },
  HCOL: { tier: 'HCOL', minMonthlyCents: 160_000, maxMonthlyCents: 240_000 },
  MCOL: { tier: 'MCOL', minMonthlyCents: 120_000, maxMonthlyCents: 180_000 },
  LCOL: { tier: 'LCOL', minMonthlyCents: 90_000, maxMonthlyCents: 150_000 },
};

/** V0 state set mapped to COL tier (metro overrides deferred to T019). */
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

/** Deterministic market rent draw fixed at character create (same seed + state → same rent). */
export function sampleMarketRentMonthly(stateCode: UsStateCode, seed: string): MoneyCents {
  const tier = STATE_COL_TIER[stateCode];
  const band = COL_TIER_RENT_BANDS[tier];
  const u = seededUniform(seed, `col-rent-${stateCode}`);
  const raw = band.minMonthlyCents + u * (band.maxMonthlyCents - band.minMonthlyCents);
  const stateBaseline = Math.max(50_00, Math.round(raw / 25_00) * 25_00);
  const metroId = metroIdForState(stateCode);
  const multiplier = getMetroRentMultiplier(metroId);
  const adjusted = stateBaseline * multiplier;
  return Math.max(50_00, Math.round(adjusted / 25_00) * 25_00);
}

export function metroIdForState(stateCode: UsStateCode): string {
  return STATE_METRO_IDS[stateCode];
}

export function colTierForState(stateCode: UsStateCode): ColTier {
  return STATE_COL_TIER[stateCode];
}
