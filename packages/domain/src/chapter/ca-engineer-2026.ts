import type { ChapterDefinition } from './types.js';

/** First authored vertical slice: CA software engineer, new grad 2026. */
export const CA_ENGINEER_2026: ChapterDefinition = {
  id: 'ca_engineer_2026',
  title: 'Chapter 1: Bay Area offer season',
  subtitle: 'Jan–Jun 2026 · Software engineer · California',
  stateCode: 'CA',
  careerSector: 'tech',
  briefingStakes:
    'You graduated into a cooling tech market. Three W2 offers landed in your inbox. Pick compensation, commute, and rent before the six-month window closes.',
  defaultOfferId: 'offer-sf-mid',
  counterfactualOfferId: 'offer-austin-remote',
  lessonUnlockSkillId: 'emergency_readiness',
  lessonUnlockCondition: 'thin_runway',
  jobOffers: [
    {
      id: 'offer-sf-mid',
      employer: 'Harbor Ledger Systems',
      title: 'Software Engineer II',
      baseSalaryAnnual: 145_000_00,
      deferral401kMatchPct: 0.04,
      commuteMinutes: 35,
      remoteDaysPerWeek: 2,
      riskTag: 'stable',
      flavor: 'SF hybrid, solid benefits, predictable promo cycle.',
    },
    {
      id: 'offer-sf-high',
      employer: 'Summit Analytics',
      title: 'Software Engineer',
      baseSalaryAnnual: 168_000_00,
      deferral401kMatchPct: 0.05,
      commuteMinutes: 50,
      remoteDaysPerWeek: 1,
      riskTag: 'growth',
      flavor: 'Higher cash, longer commute, IPO rumor mill.',
    },
    {
      id: 'offer-austin-remote',
      employer: 'Clearpath Cloud',
      title: 'Software Engineer',
      baseSalaryAnnual: 132_000_00,
      deferral401kMatchPct: 0.04,
      commuteMinutes: 0,
      remoteDaysPerWeek: 5,
      riskTag: 'stable',
      flavor: 'Fully remote, lower COL if you relocate later. Austin HQ optional.',
    },
  ],
  interrupts: [
    {
      id: 'interrupt-rto',
      type: 'return_to_office',
      title: 'Return-to-office mandate',
      description: 'Your manager schedules three in-office days starting next month. Commute time and capacity cost rise.',
      weight: 0.35,
    },
    {
      id: 'interrupt-market',
      type: 'market_surprise',
      title: 'Market drawdown',
      description: 'A macro shock hits brokerage balances. Your runway math shifts overnight.',
      weight: 0.25,
    },
    {
      id: 'interrupt-offer',
      type: 'competing_offer',
      title: 'Competing offer deadline',
      description: 'A recruiter counters with a signing bonus if you decide within two weeks.',
      weight: 0.2,
    },
  ],
};

export function getChapterDefinition(id: ChapterDefinition['id']): ChapterDefinition {
  if (id === 'ca_engineer_2026') {
    return CA_ENGINEER_2026;
  }
  return CA_ENGINEER_2026;
}
