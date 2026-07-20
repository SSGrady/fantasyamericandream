import { describe, expect, it } from 'vitest';
import {
  baselineMarketRentForSeed,
  generateRentalListingsFromCalibration,
} from '../calibration/housing/rental-listings.js';
import { playerRentShare } from '@fad/shared';

describe('rental listings calibration', () => {
  it('derives listings from same baseline as sampleMarketRentMonthly', () => {
    const input = {
      scenarioId: 'baseline',
      stateCode: 'CA' as const,
      careerSector: 'software_engineer',
      name: 'Alex',
    };
    const baseline = baselineMarketRentForSeed(input);
    const listings = generateRentalListingsFromCalibration(input);

    expect(listings.length).toBe(8);
    const tierOne = listings.find((listing) => listing.colTierFactor === 1);
    expect(tierOne).toBeDefined();
    expect(tierOne!.marketRentMonthly).toBeGreaterThanOrEqual(baseline * 0.85);
    expect(tierOne!.marketRentMonthly).toBeLessThanOrEqual(baseline * 1.15);
  });

  it('player share applies housing arrangement split', () => {
    const listing = generateRentalListingsFromCalibration({
      scenarioId: 'baseline',
      stateCode: 'TX' as const,
      careerSector: 'software_engineer',
      name: 'Sam',
    })[0]!;

    const soloShare = playerRentShare(listing.marketRentMonthly, 'solo');
    const roommateShare = playerRentShare(listing.marketRentMonthly, 'roommate_1');

    expect(soloShare).toBe(listing.marketRentMonthly);
    expect(roommateShare).toBeLessThan(soloShare);
  });
});
