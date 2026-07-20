import { describe, expect, it } from 'vitest';
import {
  buildChapterPeriod,
  canAccessOpeningBriefing,
  canAccessPlanning,
  formatChapterHeader,
  formatPeriodRange,
} from '../run-state/chapter-period.js';

describe('chapter period chronology', () => {
  it('anchors Jan 1 opening to Jul 31 closing for six-month window', () => {
    const period = buildChapterPeriod('2026-01-01');
    expect(period.openingDate).toBe('2026-01-01');
    expect(period.closingDate).toBe('2026-07-31');
    expect(formatPeriodRange(period)).toBe('Jan 2026-Jul 2026');
    expect(formatChapterHeader(period, 0)).toBe('Chapter 1: Jan 2026-Jul 2026');
  });

  it('blocks planning when period is closed or in progress', () => {
    expect(canAccessPlanning('planned')).toBe(true);
    expect(canAccessPlanning('in_progress')).toBe(false);
    expect(canAccessPlanning('closed')).toBe(false);
  });

  it('allows opening briefing only before simulation audit exists', () => {
    expect(canAccessOpeningBriefing('planned', false)).toBe(true);
    expect(canAccessOpeningBriefing('planned', true)).toBe(false);
    expect(canAccessOpeningBriefing('closed', true)).toBe(false);
  });
});
