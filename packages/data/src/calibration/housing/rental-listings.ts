import type { MoneyCents, UsStateCode } from '@fad/shared';
import { sampleMarketRentMonthly } from './col-tiers.js';

export interface RentalListingSeedInput {
  scenarioId: string;
  stateCode: UsStateCode;
  careerSector: string;
  name: string;
}

export interface RentalListingData {
  id: string;
  address: string;
  neighborhood: string;
  city: string;
  stateCode: UsStateCode;
  marketRentMonthly: MoneyCents;
  beds: number;
  baths: number;
  sqft: number;
  flavor: string;
  colTierFactor: number;
}

const NEIGHBORHOOD_FLAVORS = [
  'Walkable cafes and transit',
  'Quiet residential blocks',
  'Near parks and trails',
  'Urban core, lively nights',
  'Suburban comfort, parking included',
  'Arts district, older buildings',
  'Newer construction, gym in building',
  'Commuter-friendly, near highway',
] as const;

const STREET_NAMES = [
  'Birch Street',
  'Cedar Avenue',
  'Maple Court',
  'Willow Lane',
  'Oak Terrace',
  'Pine Grove',
  'Harbor View',
  'Summit Place',
] as const;

/** Listing spread factors around the COL-tier baseline (seeded). */
export const COL_TIER_FACTORS = [0.68, 0.76, 0.84, 0.92, 1.0, 1.08, 1.16, 1.24] as const;

const METRO_LABELS: Record<UsStateCode, string> = {
  CA: 'Oakland',
  NY: 'Yonkers',
  WA: 'Tacoma',
  TX: 'Round Rock',
  FL: 'Tampa',
  GA: 'Marietta',
  IL: 'Naperville',
  NC: 'Raleigh',
  SC: 'Greenville',
  TN: 'Franklin',
};

function listingSeed(input: RentalListingSeedInput): string {
  return `${input.scenarioId}-${input.stateCode}-${input.careerSector}-${input.name.trim() || 'anon'}`;
}

function seededUnit(seed: string, index: number): number {
  let state = 0;
  const input = `${seed}:rental:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    state = (state + input.charCodeAt(i) * (i + 1)) >>> 0;
  }
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0x100000000;
}

export function baselineMarketRentForSeed(input: RentalListingSeedInput): MoneyCents {
  return sampleMarketRentMonthly(input.stateCode, listingSeed(input));
}

export function marketRentForListingTier(
  baseline: MoneyCents,
  seed: string,
  index: number,
): MoneyCents {
  const tierFactor = COL_TIER_FACTORS[index] ?? 1;
  const jitter = (seededUnit(seed, index * 7 + 3) - 0.5) * 0.14;
  const raw = baseline * (tierFactor + jitter);
  return Math.max(50_00, Math.round(raw / 25_00) * 25_00);
}

/** Deterministic rental listings from COL-tier calibration (locked at pick time). */
export function generateRentalListingsFromCalibration(
  input: RentalListingSeedInput,
  count = 8,
): RentalListingData[] {
  const seed = listingSeed(input);
  const baseline = baselineMarketRentForSeed(input);
  const city = METRO_LABELS[input.stateCode];
  const listings: RentalListingData[] = [];

  for (let i = 0; i < count; i += 1) {
    const unit = seededUnit(seed, i);
    const tierFactor = COL_TIER_FACTORS[i] ?? 1;
    const marketRentMonthly = marketRentForListingTier(baseline, seed, i);
    const beds = 1 + Math.floor(unit * 3);
    const baths = 1 + Math.floor(seededUnit(seed, i + 11) * 2);
    const sqft = 550 + Math.floor(seededUnit(seed, i + 22) * 1400);

    listings.push({
      id: `rental-${input.stateCode}-${i}`,
      address: `${120 + Math.floor(seededUnit(seed, i + 33) * 900)} ${STREET_NAMES[i] ?? 'Main Street'}`,
      neighborhood: `${city} ${['Heights', 'District', 'Village', 'Quarter', 'Commons'][i % 5]}`,
      city,
      stateCode: input.stateCode,
      marketRentMonthly,
      beds,
      baths,
      sqft,
      flavor: NEIGHBORHOOD_FLAVORS[i % NEIGHBORHOOD_FLAVORS.length] ?? 'Mixed neighborhood',
      colTierFactor: tierFactor,
    });
  }

  return listings.sort((a, b) => a.marketRentMonthly - b.marketRentMonthly);
}
