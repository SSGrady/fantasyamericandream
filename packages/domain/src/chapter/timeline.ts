import type { ChapterInterrupt } from './types.js';
import type { ChapterPeriod } from '../run-state/types.js';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Feb-Jul labels for the six-month sim window after Jan 1 opening. */
export function chapterSimMonthLabels(period: ChapterPeriod): string[] {
  const planStart = new Date(`${period.openingDate}T00:00:00Z`);
  planStart.setUTCMonth(planStart.getUTCMonth() + 1);
  const labels: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const d = new Date(planStart);
    d.setUTCMonth(d.getUTCMonth() + i);
    labels.push(MONTH_NAMES[d.getUTCMonth()] ?? '???');
  }
  return labels;
}

/** Authored month index (0-5) where an interrupt lands on the sim rail. */
export function interruptMonthIndex(interrupt: ChapterInterrupt): number {
  if (interrupt.type === 'return_to_office') return 2;
  if (interrupt.type === 'competing_offer') return 1;
  if (interrupt.type === 'market_surprise') return 4;
  return 2;
}
