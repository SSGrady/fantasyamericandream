import { describe, expect, it } from 'vitest';
import type { AuditSnapshot } from '@fad/shared';
import { renderStakeholderReactions } from '../reactions.js';

const baseAudit: AuditSnapshot = {
  asOf: '2026-06-30',
  netWorth: 45_000_00,
  netWorthDelta: 3_500_00,
  waterfall: [],
  savingsRate: 0.18,
  emergencyRunwayMonths: 4.5,
  contributionProgress: {
    traditional401k: {
      contributedCents: 4_500_00,
      limitCents: 23_500_00,
      remainingCents: 19_000_00,
      pctOfLimit: 0.19,
    },
    rothIra: {
      contributedCents: 0,
      limitCents: 7_000_00,
      remainingCents: 7_000_00,
      pctOfLimit: 0,
    },
  },
};

describe('renderStakeholderReactions', () => {
  it('returns four stakeholder cards', () => {
    const reactions = renderStakeholderReactions(baseAudit, { housingBurdenPct: 0.28 });
    expect(reactions).toHaveLength(4);
    expect(reactions.map((r) => r.id)).toEqual([
      'partner',
      'future_you_35',
      'recruiter',
      'fee_planner',
    ]);
  });

  it('flags high housing burden for partner', () => {
    const reactions = renderStakeholderReactions(baseAudit, { housingBurdenPct: 0.42 });
    const partner = reactions.find((r) => r.id === 'partner');
    expect(partner?.sentiment).toBe('Concerned');
    expect(partner?.note).toContain('42%');
  });

  it('warns fee planner when runway is thin', () => {
    const reactions = renderStakeholderReactions(
      { ...baseAudit, emergencyRunwayMonths: 1.5, savingsRate: 0.03 },
      { housingBurdenPct: 0.3 },
    );
    const planner = reactions.find((r) => r.id === 'fee_planner');
    expect(planner?.sentiment).toBe('Concerned');
  });
});
