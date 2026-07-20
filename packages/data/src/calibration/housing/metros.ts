import type { UsStateCode } from '@fad/shared';

/** ZORI-style monthly rent anchor for a top-GDP metro (USD, not thousands). */
export interface MetroRentAnchor {
  metroId: string;
  name: string;
  stateCode: UsStateCode | string;
  gdpRank: number;
  /** Monthly median rent anchor in USD (e.g. 2442.50). */
  zoriMonthlyUsd: number;
  /** Multiplier vs state COL-tier midpoint baseline. */
  rentMultiplierVsState: number;
}

/** Top 25 US metros by GDP with ZORI-style monthly rent anchors (calibration-2026 stub). */
export const METRO_RENT_ANCHORS: MetroRentAnchor[] = [
  { metroId: 'new_york_city', name: 'New York City', stateCode: 'NY', gdpRank: 1, zoriMonthlyUsd: 2442.5, rentMultiplierVsState: 0.905 },
  { metroId: 'los_angeles', name: 'Los Angeles', stateCode: 'CA', gdpRank: 2, zoriMonthlyUsd: 1354.7, rentMultiplierVsState: 0.502 },
  { metroId: 'chicago', name: 'Chicago', stateCode: 'IL', gdpRank: 3, zoriMonthlyUsd: 1650, rentMultiplierVsState: 0.825 },
  { metroId: 'dallas_fort_worth', name: 'Dallas-Fort Worth', stateCode: 'TX', gdpRank: 4, zoriMonthlyUsd: 1420, rentMultiplierVsState: 0.947 },
  { metroId: 'houston', name: 'Houston', stateCode: 'TX', gdpRank: 5, zoriMonthlyUsd: 1280, rentMultiplierVsState: 0.853 },
  { metroId: 'washington_dc', name: 'Washington DC', stateCode: 'VA', gdpRank: 6, zoriMonthlyUsd: 1980, rentMultiplierVsState: 0.99 },
  { metroId: 'philadelphia', name: 'Philadelphia', stateCode: 'PA', gdpRank: 7, zoriMonthlyUsd: 1520, rentMultiplierVsState: 0.84 },
  { metroId: 'miami', name: 'Miami', stateCode: 'FL', gdpRank: 8, zoriMonthlyUsd: 2100, rentMultiplierVsState: 1.75 },
  { metroId: 'atlanta', name: 'Atlanta', stateCode: 'GA', gdpRank: 9, zoriMonthlyUsd: 1580, rentMultiplierVsState: 1.053 },
  { metroId: 'boston', name: 'Boston', stateCode: 'MA', gdpRank: 10, zoriMonthlyUsd: 2250, rentMultiplierVsState: 0.83 },
  { metroId: 'phoenix', name: 'Phoenix', stateCode: 'AZ', gdpRank: 11, zoriMonthlyUsd: 1380, rentMultiplierVsState: 0.92 },
  { metroId: 'san_francisco', name: 'San Francisco', stateCode: 'CA', gdpRank: 12, zoriMonthlyUsd: 2100, rentMultiplierVsState: 0.778 },
  { metroId: 'seattle', name: 'Seattle', stateCode: 'WA', gdpRank: 13, zoriMonthlyUsd: 1950, rentMultiplierVsState: 0.975 },
  { metroId: 'detroit', name: 'Detroit', stateCode: 'MI', gdpRank: 14, zoriMonthlyUsd: 1180, rentMultiplierVsState: 0.79 },
  { metroId: 'minneapolis', name: 'Minneapolis', stateCode: 'MN', gdpRank: 15, zoriMonthlyUsd: 1320, rentMultiplierVsState: 0.88 },
  { metroId: 'san_diego', name: 'San Diego', stateCode: 'CA', gdpRank: 16, zoriMonthlyUsd: 1750, rentMultiplierVsState: 0.648 },
  { metroId: 'tampa', name: 'Tampa', stateCode: 'FL', gdpRank: 17, zoriMonthlyUsd: 1680, rentMultiplierVsState: 1.4 },
  { metroId: 'denver', name: 'Denver', stateCode: 'CO', gdpRank: 18, zoriMonthlyUsd: 1720, rentMultiplierVsState: 1.05 },
  { metroId: 'baltimore', name: 'Baltimore', stateCode: 'MD', gdpRank: 19, zoriMonthlyUsd: 1450, rentMultiplierVsState: 0.97 },
  { metroId: 'charlotte', name: 'Charlotte', stateCode: 'NC', gdpRank: 20, zoriMonthlyUsd: 1380, rentMultiplierVsState: 0.92 },
  { metroId: 'orlando', name: 'Orlando', stateCode: 'FL', gdpRank: 21, zoriMonthlyUsd: 1550, rentMultiplierVsState: 1.292 },
  { metroId: 'san_antonio', name: 'San Antonio', stateCode: 'TX', gdpRank: 22, zoriMonthlyUsd: 1180, rentMultiplierVsState: 0.787 },
  { metroId: 'portland', name: 'Portland', stateCode: 'OR', gdpRank: 23, zoriMonthlyUsd: 1520, rentMultiplierVsState: 0.91 },
  { metroId: 'sacramento', name: 'Sacramento', stateCode: 'CA', gdpRank: 24, zoriMonthlyUsd: 1450, rentMultiplierVsState: 0.537 },
  { metroId: 'austin', name: 'Austin', stateCode: 'TX', gdpRank: 25, zoriMonthlyUsd: 1520, rentMultiplierVsState: 1.013 },
];

const byMetroId = new Map<string, MetroRentAnchor>(
  METRO_RENT_ANCHORS.map((metro) => [metro.metroId, metro]),
);

/** Default multiplier when metro is not in the anchor table. */
export const DEFAULT_METRO_RENT_MULTIPLIER = 1;

export function getMetroRentAnchor(metroId: string): MetroRentAnchor | undefined {
  return byMetroId.get(metroId);
}

export function getMetroRentMultiplier(metroId: string): number {
  return byMetroId.get(metroId)?.rentMultiplierVsState ?? DEFAULT_METRO_RENT_MULTIPLIER;
}

export function listMetroRentAnchors(): MetroRentAnchor[] {
  return [...METRO_RENT_ANCHORS];
}
