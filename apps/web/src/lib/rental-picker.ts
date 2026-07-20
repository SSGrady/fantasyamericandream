import { buildV0ScenarioFixture } from '@fad/data';
import type { MoneyCents, UsStateCode, V1CharacterDraft } from '@fad/shared';
import { playerRentShare } from '@fad/shared';

export interface RentalListing {
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
];

const STREET_NAMES = [
  'Birch Street',
  'Cedar Avenue',
  'Maple Court',
  'Willow Lane',
  'Oak Terrace',
  'Pine Grove',
  'Harbor View',
  'Summit Place',
];

function seededUnit(seed: string, index: number): number {
  let state = 0;
  const input = `${seed}:rental:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    state = (state + input.charCodeAt(i) * (i + 1)) >>> 0;
  }
  state = (state * 1664525 + 1013904223) >>> 0;
  return state / 0x100000000;
}

function metroLabel(stateCode: UsStateCode): string {
  const labels: Record<UsStateCode, string> = {
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
  return labels[stateCode];
}

function baselineMarketRent(draft: V1CharacterDraft): MoneyCents {
  const fixture = buildV0ScenarioFixture({
    id: `${draft.careerSector}_${draft.stateCode.toLowerCase()}`,
    career: draft.careerSector,
    stateCode: draft.stateCode,
    randomSeed: `rental-${draft.scenarioId}`,
  });
  return fixture.location.marketRentMonthly;
}

export function generateRentalListings(draft: V1CharacterDraft): RentalListing[] {
  const seed = `${draft.scenarioId}-${draft.stateCode}-${draft.careerSector}-${draft.name.trim() || 'anon'}`;
  const baseline = baselineMarketRent(draft);
  const city = metroLabel(draft.stateCode);
  const listings: RentalListing[] = [];

  for (let i = 0; i < 8; i += 1) {
    const unit = seededUnit(seed, i);
    const rentFactor = 0.72 + unit * 0.55;
    const marketRentMonthly = Math.round(baseline * rentFactor);
    const beds = 1 + Math.floor(unit * 3);
    const baths = 1 + Math.floor(seededUnit(seed, i + 11) * 2);
    const sqft = 550 + Math.floor(seededUnit(seed, i + 22) * 1400);

    listings.push({
      id: `rental-${draft.stateCode}-${i}`,
      address: `${120 + i * 13} ${STREET_NAMES[i] ?? 'Main Street'}`,
      neighborhood: `${city} ${['Heights', 'District', 'Village', 'Quarter', 'Commons'][i % 5]}`,
      city,
      stateCode: draft.stateCode,
      marketRentMonthly,
      beds,
      baths,
      sqft,
      flavor: NEIGHBORHOOD_FLAVORS[i % NEIGHBORHOOD_FLAVORS.length] ?? 'Mixed neighborhood',
    });
  }

  return listings.sort((a, b) => a.marketRentMonthly - b.marketRentMonthly);
}

export function playerShareForListing(
  listing: RentalListing,
  draft: V1CharacterDraft,
): MoneyCents {
  return playerRentShare(listing.marketRentMonthly, draft.housingArrangement);
}

export function rentalPickerSeed(draft: V1CharacterDraft): string {
  return `${draft.scenarioId}-${draft.stateCode}-${draft.careerSector}`;
}
