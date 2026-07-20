import type { ChapterDefinition, ChapterInterrupt } from './types.js';

/** Seeded interrupt roll for chapter (weight-based, one draw per period). */
export function rollChapterInterrupt(
  chapter: ChapterDefinition,
  seed: string,
  periodIndex: number,
): ChapterInterrupt | null {
  const rng = seededFloat(`${seed}:interrupt:${periodIndex}`);
  const totalWeight = chapter.interrupts.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return null;

  const threshold = 0.45 * totalWeight;
  if (rng * totalWeight > threshold) return null;

  let cursor = rng * threshold;
  for (const interrupt of chapter.interrupts) {
    cursor -= interrupt.weight;
    if (cursor <= 0) return interrupt;
  }
  return chapter.interrupts[0] ?? null;
}

export interface InterruptChoice {
  interruptId: string;
  choiceId: string;
}

/** Apply RTO choice to weekly capacity (commute eats hours). */
export function applyInterruptCapacityDelta(
  interrupt: ChapterInterrupt,
  choiceId: string,
): number {
  if (interrupt.type === 'return_to_office' && choiceId === 'accept-rto') {
    return -4;
  }
  if (interrupt.type === 'return_to_office' && choiceId === 'negotiate-hybrid') {
    return -2;
  }
  return 0;
}

function seededFloat(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  h = (h * 1664525 + 1013904223) | 0;
  return (h >>> 0) / 0xffffffff;
}
