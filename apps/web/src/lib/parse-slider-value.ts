import type { ChangeEvent } from 'react';
import { parseSliderNumber } from '@fad/shared';

/** Read a bounded integer from a range input change event. */
export function parseRangeInputValue(event: ChangeEvent<HTMLInputElement>, fallback = 0): number {
  return parseSliderNumber(event.currentTarget.value, fallback);
}
