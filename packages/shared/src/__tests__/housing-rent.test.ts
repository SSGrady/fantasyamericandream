import { describe, expect, it } from 'vitest';
import {
  defaultHousingArrangement,
  housingArrangementFraction,
  isHousingArrangementAllowed,
  playerRentShare,
} from '../types/housing-rent.js';

describe('housing rent split', () => {
  it('applies grill-me fractions to market rent', () => {
    expect(playerRentShare(2_500_00, 'roommates_4')).toBe(625_00);
    expect(playerRentShare(2_500_00, 'roommate_1')).toBe(1_250_00);
    expect(playerRentShare(2_500_00, 'solo')).toBe(2_500_00);
    expect(playerRentShare(2_500_00, 'partner_split')).toBe(1_250_00);
    expect(playerRentShare(2_500_00, 'pay_alone')).toBe(2_500_00);
  });

  it('gates options by marital status', () => {
    expect(isHousingArrangementAllowed('roommates_4', 'single')).toBe(true);
    expect(isHousingArrangementAllowed('partner_split', 'single')).toBe(false);
    expect(isHousingArrangementAllowed('partner_split', 'married')).toBe(true);
    expect(defaultHousingArrangement('partnered')).toBe('partner_split');
    expect(housingArrangementFraction('roommates_4')).toBe(0.25);
  });
});
