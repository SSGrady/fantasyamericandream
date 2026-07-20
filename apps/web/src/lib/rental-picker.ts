import {
  generateRentalListingsFromCalibration,
  type RentalListingData,
  type RentalListingSeedInput,
} from '@fad/data';
import type { V1CharacterDraft } from '@fad/shared';
import { playerRentShare } from '@fad/shared';

export type RentalListing = RentalListingData;

export function generateRentalListings(draft: V1CharacterDraft): RentalListing[] {
  const input: RentalListingSeedInput = {
    scenarioId: draft.scenarioId,
    stateCode: draft.stateCode,
    careerSector: draft.careerSector,
    name: draft.name,
  };
  return generateRentalListingsFromCalibration(input);
}

export function playerShareForListing(
  listing: RentalListing,
  draft: V1CharacterDraft,
): number {
  return playerRentShare(listing.marketRentMonthly, draft.housingArrangement);
}

export function rentalPickerSeed(draft: V1CharacterDraft): string {
  return `${draft.scenarioId}-${draft.stateCode}-${draft.careerSector}`;
}

export function draftMarketRentMonthly(draft: V1CharacterDraft): number {
  const input: RentalListingSeedInput = {
    scenarioId: draft.scenarioId,
    stateCode: draft.stateCode,
    careerSector: draft.careerSector,
    name: draft.name,
  };
  const listings = generateRentalListingsFromCalibration(input, 1);
  return listings[0]?.marketRentMonthly ?? 0;
}
