import { describe, expect, it } from 'vitest';
import { CA_ENGINEER_2026 } from '../chapter/ca-engineer-2026.js';
import { evaluateChapterLessonUnlock } from '../chapter/lesson-unlocks.js';
import { rollChapterInterrupt } from '../chapter/interrupts.js';
import { chapterPhaseRoute, routeChapterPhase } from '../chapter/routing.js';

describe('CA engineer chapter', () => {
  it('defines three job offers', () => {
    expect(CA_ENGINEER_2026.jobOffers).toHaveLength(3);
  });

  it('maps phases to routes', () => {
    expect(chapterPhaseRoute('planning')).toBe('/play/planning');
    expect(routeChapterPhase('/play/counterfactual')).toBe('counterfactual');
  });

  it('rolls interrupts deterministically', () => {
    const first = rollChapterInterrupt(CA_ENGINEER_2026, 'demo-seed', 0);
    const second = rollChapterInterrupt(CA_ENGINEER_2026, 'demo-seed', 0);
    expect(first).toEqual(second);
  });

  it('unlocks emergency readiness on thin runway', () => {
    const unlock = evaluateChapterLessonUnlock(CA_ENGINEER_2026, {
      asOf: '2026-06-30',
      startNetWorth: 8_000_00,
      netWorth: 5_000_00,
      netWorthDelta: -3_000_00,
      waterfall: [],
      periodNetPayCents: 12_000_00,
      savingsRate: 0.05,
      deferral401kRate: 0.03,
      cashSurplusRate: 0.02,
      emergencyRunwayMonths: 2,
      contributionProgress: {},
    });
    expect(unlock?.skillId).toBe('emergency_readiness');
  });
});
