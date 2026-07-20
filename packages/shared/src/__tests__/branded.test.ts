import { describe, expect, it } from 'vitest';
import { moneyCents, parseMoneyCents, unwrapMoneyCents } from '../types/branded.js';

describe('branded financial types', () => {
  it('constructs and unwraps MoneyCents', () => {
    const cents = moneyCents(100_00);
    expect(unwrapMoneyCents(cents)).toBe(100_00);
  });

  it('parses JSON numbers with runtime guard', () => {
    expect(parseMoneyCents(50_00)).toBe(50_00);
    expect(() => parseMoneyCents('50')).toThrow();
  });
});
