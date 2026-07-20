import type { MoneyCents, UsStateCode } from '@fad/shared';
import { colTierForState, sampleMarketRentMonthly } from './col-tiers.js';

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
  /** First month move-in cash (deposit + first month). */
  moveInCashCents?: MoneyCents;
  /** Estimated monthly utilities not included in rent. */
  utilitiesMonthlyCents?: MoneyCents;
  /** Typical one-way commute in minutes. */
  commuteMinutes?: number;
  /** Rent + utilities + transit estimate for player share context. */
  monthlyLifeCostCents?: MoneyCents;
  /** Rough months added to DreamHome down-payment goal at current savings. */
  goalDelayMonths?: number;
  roommateSplit?: number;
}

/** Listing spread factors around the COL-tier baseline (seeded). */
export const COL_TIER_FACTORS = [0.72, 0.82, 0.9, 0.98, 1.05, 1.12, 1.2, 1.32] as const;

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

const CA_LISTING_PROFILES: {
  city: string;
  neighborhood: string;
  flavor: string;
  beds: number;
  baths: number;
  sqftMin: number;
  sqftMax: number;
  rentMinCents: MoneyCents;
  rentMaxCents: MoneyCents;
  commuteMinutes: number;
  utilitiesCents: MoneyCents;
  roommateSplit?: number;
}[] = [
  {
    city: 'Oakland',
    neighborhood: 'Fruitvale',
    flavor: 'Cheapest with roommates, longer BART ride',
    beds: 1,
    baths: 1,
    sqftMin: 520,
    sqftMax: 680,
    rentMinCents: 1_650_00,
    rentMaxCents: 2_100_00,
    commuteMinutes: 52,
    utilitiesCents: 95_00,
    roommateSplit: 4,
  },
  {
    city: 'Los Angeles',
    neighborhood: 'Koreatown',
    flavor: 'Balanced commute, older walk-up',
    beds: 1,
    baths: 1,
    sqftMin: 550,
    sqftMax: 750,
    rentMinCents: 2_200_00,
    rentMaxCents: 2_800_00,
    commuteMinutes: 38,
    utilitiesCents: 110_00,
    roommateSplit: 2,
  },
  {
    city: 'San Francisco',
    neighborhood: 'Inner Sunset',
    flavor: 'Car-free urban, Muni lines nearby',
    beds: 0,
    baths: 1,
    sqftMin: 420,
    sqftMax: 580,
    rentMinCents: 2_400_00,
    rentMaxCents: 3_100_00,
    commuteMinutes: 28,
    utilitiesCents: 85_00,
  },
  {
    city: 'San Jose',
    neighborhood: 'Willow Glen',
    flavor: 'Suburb comfort, parking included',
    beds: 2,
    baths: 1,
    sqftMin: 780,
    sqftMax: 950,
    rentMinCents: 2_600_00,
    rentMaxCents: 3_400_00,
    commuteMinutes: 45,
    utilitiesCents: 130_00,
  },
  {
    city: 'Oakland',
    neighborhood: 'Rockridge',
    flavor: 'Roommate split on a 2BR near BART',
    beds: 2,
    baths: 1,
    sqftMin: 820,
    sqftMax: 980,
    rentMinCents: 3_200_00,
    rentMaxCents: 3_900_00,
    commuteMinutes: 32,
    utilitiesCents: 120_00,
    roommateSplit: 2,
  },
  {
    city: 'San Francisco',
    neighborhood: 'SOMA',
    flavor: 'Newer construction, gym in building',
    beds: 1,
    baths: 1,
    sqftMin: 580,
    sqftMax: 720,
    rentMinCents: 3_000_00,
    rentMaxCents: 3_800_00,
    commuteMinutes: 22,
    utilitiesCents: 100_00,
  },
  {
    city: 'Los Angeles',
    neighborhood: 'Silver Lake',
    flavor: '1BR with view, premium location',
    beds: 1,
    baths: 1,
    sqftMin: 650,
    sqftMax: 850,
    rentMinCents: 2_900_00,
    rentMaxCents: 3_600_00,
    commuteMinutes: 35,
    utilitiesCents: 115_00,
  },
  {
    city: 'San Francisco',
    neighborhood: 'Pacific Heights',
    flavor: 'Expensive newer unit, short commute',
    beds: 1,
    baths: 1,
    sqftMin: 700,
    sqftMax: 900,
    rentMinCents: 3_500_00,
    rentMaxCents: 4_200_00,
    commuteMinutes: 18,
    utilitiesCents: 140_00,
  },
];

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
  const jitter = (seededUnit(seed, index * 7 + 3) - 0.5) * 0.12;
  const raw = baseline * (tierFactor + jitter);
  return Math.max(50_00, Math.round(raw / 25_00) * 25_00);
}

function generateCaliforniaListings(seed: string, count: number): RentalListingData[] {
  const listings: RentalListingData[] = [];

  for (let i = 0; i < count; i += 1) {
    const profile = CA_LISTING_PROFILES[i % CA_LISTING_PROFILES.length]!;
    const unit = seededUnit(seed, i);
    const rentRange = profile.rentMaxCents - profile.rentMinCents;
    const marketRentMonthly = Math.round((profile.rentMinCents + unit * rentRange) / 25_00) * 25_00;
    const sqft =
      profile.sqftMin + Math.floor(seededUnit(seed, i + 22) * (profile.sqftMax - profile.sqftMin));
    const utilitiesMonthlyCents = profile.utilitiesCents;
    const transitEstimate = profile.commuteMinutes > 40 ? 120_00 : 95_00;
    const monthlyLifeCostCents = marketRentMonthly + utilitiesMonthlyCents + transitEstimate;
    const moveInCashCents = marketRentMonthly * 2 + 500_00;
    const goalDelayMonths = Math.max(1, Math.round((marketRentMonthly / 75_000) * 6));

    listings.push({
      id: `rental-CA-${i}`,
      address: `${120 + Math.floor(seededUnit(seed, i + 33) * 900)} ${['Birch', 'Cedar', 'Maple', 'Willow'][i % 4]} St`,
      neighborhood: profile.neighborhood,
      city: profile.city,
      stateCode: 'CA',
      marketRentMonthly,
      beds: profile.beds,
      baths: profile.baths,
      sqft,
      flavor: profile.flavor,
      colTierFactor: COL_TIER_FACTORS[i] ?? 1,
      moveInCashCents,
      utilitiesMonthlyCents,
      commuteMinutes: profile.commuteMinutes,
      monthlyLifeCostCents,
      goalDelayMonths,
      roommateSplit: profile.roommateSplit,
    });
  }

  return listings.sort((a, b) => a.marketRentMonthly - b.marketRentMonthly);
}

/** Deterministic rental listings from COL-tier calibration (locked at pick time). */
export function generateRentalListingsFromCalibration(
  input: RentalListingSeedInput,
  count = 8,
): RentalListingData[] {
  if (colTierForState(input.stateCode) === 'VHCOL' && input.stateCode === 'CA') {
    return generateCaliforniaListings(listingSeed(input), count);
  }

  const seed = listingSeed(input);
  const baseline = baselineMarketRentForSeed(input);
  const city = METRO_LABELS[input.stateCode];
  const tier = colTierForState(input.stateCode);
  const sqftCap = tier === 'VHCOL' ? 950 : tier === 'HCOL' ? 1200 : 1600;
  const sqftFloor = tier === 'VHCOL' ? 450 : 550;
  const listings: RentalListingData[] = [];

  for (let i = 0; i < count; i += 1) {
    const unit = seededUnit(seed, i);
    const tierFactor = COL_TIER_FACTORS[i] ?? 1;
    const marketRentMonthly = marketRentForListingTier(baseline, seed, i);
    const beds = tier === 'VHCOL' ? Math.min(2, Math.floor(unit * 2)) : 1 + Math.floor(unit * 3);
    const baths = 1 + Math.floor(seededUnit(seed, i + 11) * (tier === 'VHCOL' ? 1 : 2));
    const sqft = sqftFloor + Math.floor(seededUnit(seed, i + 22) * (sqftCap - sqftFloor));
    const utilitiesMonthlyCents = 80_00 + Math.floor(seededUnit(seed, i + 44) * 80_00);
    const commuteMinutes = 20 + Math.floor(seededUnit(seed, i + 55) * 50);
    const monthlyLifeCostCents = marketRentMonthly + utilitiesMonthlyCents + 95_00;

    listings.push({
      id: `rental-${input.stateCode}-${i}`,
      address: `${120 + Math.floor(seededUnit(seed, i + 33) * 900)} Main Street`,
      neighborhood: `${city} ${['Heights', 'District', 'Village', 'Quarter', 'Commons'][i % 5]}`,
      city,
      stateCode: input.stateCode,
      marketRentMonthly,
      beds,
      baths,
      sqft,
      flavor: NEIGHBORHOOD_FLAVORS[i % NEIGHBORHOOD_FLAVORS.length] ?? 'Mixed neighborhood',
      colTierFactor: tierFactor,
      moveInCashCents: marketRentMonthly * 2 + 400_00,
      utilitiesMonthlyCents,
      commuteMinutes,
      monthlyLifeCostCents,
      goalDelayMonths: Math.max(1, Math.round(marketRentMonthly / 80_000)),
    });
  }

  return listings.sort((a, b) => a.marketRentMonthly - b.marketRentMonthly);
}
