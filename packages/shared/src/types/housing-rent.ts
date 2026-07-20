import type { MoneyCents } from './game-state.js';

export type V1MaritalStatus = 'single' | 'partnered' | 'married';

export type V1HousingArrangement =
  | 'roommates_4'
  | 'roommate_1'
  | 'solo'
  | 'partner_split'
  | 'pay_alone';

/** Player share of market rent or utilities for a housing arrangement. */
export function housingArrangementFraction(arrangement: V1HousingArrangement): number {
  switch (arrangement) {
    case 'roommates_4':
      return 0.25;
    case 'roommate_1':
    case 'partner_split':
      return 0.5;
    case 'solo':
    case 'pay_alone':
      return 1;
    default: {
      const _exhaustive: never = arrangement;
      return _exhaustive;
    }
  }
}

export function playerRentShare(
  marketRentMonthly: MoneyCents,
  arrangement: V1HousingArrangement,
): MoneyCents {
  if (marketRentMonthly <= 0) {
    return 0;
  }
  return Math.round(marketRentMonthly * housingArrangementFraction(arrangement));
}

export function defaultHousingArrangement(maritalStatus: V1MaritalStatus): V1HousingArrangement {
  if (maritalStatus === 'single') {
    return 'solo';
  }
  return 'partner_split';
}

export function isHousingArrangementAllowed(
  arrangement: V1HousingArrangement,
  maritalStatus: V1MaritalStatus,
): boolean {
  if (maritalStatus === 'single') {
    return arrangement === 'roommates_4' || arrangement === 'roommate_1' || arrangement === 'solo';
  }
  return arrangement === 'partner_split' || arrangement === 'pay_alone' || arrangement === 'solo';
}
