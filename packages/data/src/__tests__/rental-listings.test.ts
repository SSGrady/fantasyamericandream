import { describe, expect, it } from 'vitest';
import {
  baselineMarketRentForSeed,
  generateRentalListingsFromCalibration,
} from '../calibration/housing/rental-listings.js';
import { playerRentShare } from '@fad/shared';

describe('rental listings calibration', () => {
  it('CA listings use realistic VHCOL rent and sqft bands', () => {
    const input = {
      scenarioId: 'baseline',
      stateCode: 'CA' as const,
      careerSector: 'software_engineer',
      name: 'Alex',
    };
    const listings = generateRentalListingsFromCalibration(input);

    expect(listings.length).toBe(8);
    expect(listings[0]!.marketRentMonthly).toBeGreaterThanOrEqual(1_600_00);
    expect(listings[listings.length - 1]!.marketRentMonthly).toBeLessThanOrEqual(4_500_00);
    expect(listings[0]!.sqft).toBeLessThanOrEqual(1000);
    expect(listings[0]!.moveInCashCents).toBeGreaterThan(0);
  });

  it('derives listings from same baseline as sampleMarketRentMonthly', () => {
    const input = {
      scenarioId: 'baseline',
      stateCode: 'TX' as const,
      careerSector: 'software_engineer',
      name: 'Alex',
    };
    const baseline = baselineMarketRentForSeed(input);
    const listings = generateRentalListingsFromCalibration(input);

    expect(listings.length).toBe(8);
    const midListing = listings[Math.floor(listings.length / 2)]!;
    expect(midListing.marketRentMonthly).toBeGreaterThanOrEqual(baseline * 0.7);
    expect(midListing.marketRentMonthly).toBeLessThanOrEqual(baseline * 1.35);
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
