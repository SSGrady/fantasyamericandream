import type { CareerSector, LiteracySkillId, MoneyCents, UsStateCode } from '@fad/shared';

export type ChapterId = 'ca_engineer_2026';

export interface JobOffer {
  id: string;
  employer: string;
  title: string;
  baseSalaryAnnual: MoneyCents;
  deferral401kMatchPct: number;
  commuteMinutes: number;
  remoteDaysPerWeek: number;
  riskTag: 'stable' | 'growth' | 'volatile';
  flavor: string;
}

export interface ChapterInterrupt {
  id: string;
  type: 'return_to_office' | 'market_surprise' | 'competing_offer';
  title: string;
  description: string;
  /** Seeded probability weight 0-1 for chapter roll. */
  weight: number;
}

export interface ChapterDefinition {
  id: ChapterId;
  title: string;
  subtitle: string;
  stateCode: UsStateCode;
  careerSector: CareerSector;
  briefingStakes: string;
  jobOffers: JobOffer[];
  interrupts: ChapterInterrupt[];
  defaultOfferId: string;
  counterfactualOfferId: string;
  lessonUnlockSkillId: LiteracySkillId;
  lessonUnlockCondition: 'thin_runway' | 'positive_savings';
}
