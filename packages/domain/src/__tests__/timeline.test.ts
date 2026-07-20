import { describe, expect, it } from 'vitest';
import { CA_ENGINEER_2026 } from '../chapter/ca-engineer-2026.js';
import { chapterSimMonthLabels, interruptMonthIndex } from '../chapter/timeline.js';
import { buildChapterPeriod } from '../run-state/chapter-period.js';

describe('chapter timeline', () => {
  it('returns Feb-Jul labels for Jan 1 opening', () => {
    const period = buildChapterPeriod('2026-01-01', 'planned');
    expect(chapterSimMonthLabels(period)).toEqual(['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']);
  });

  it('maps RTO interrupt to April index', () => {
    const interrupt = CA_ENGINEER_2026.interrupts[0]!;
    expect(interruptMonthIndex(interrupt)).toBe(2);
  });
});
