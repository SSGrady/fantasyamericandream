import type { CareerSector, Difficulty, MacroRegime } from './game-state.js';
import type { LiteracySkillId } from './literacy-skills.js';

export type EventCategory =
  | 'career'
  | 'housing'
  | 'health'
  | 'relationship'
  | 'children'
  | 'transportation'
  | 'insurance'
  | 'taxes'
  | 'investing'
  | 'consumer'
  | 'hazard'
  | 'fraud'
  | 'education'
  | 'family'
  | 'legal'
  | 'opportunity'
  | 'quiet';

export interface EventSeverityOutcome {
  id: string;
  weight: number;
  salaryResetPct?: number;
  rentIncreasePct?: number;
  bonusPct?: number;
  marketReturnShift?: number;
}

export interface EventChoiceDefinition {
  id: string;
  label: string;
  requiresLiteracy?: LiteracySkillId[];
}

export interface EventDefinition {
  id: string;
  title: string;
  category: EventCategory;
  eligibility?: {
    minTenureMonths?: number;
    sectors?: CareerSector[];
    employmentType?: 'w2' | 'contractor' | 'unemployed' | 'student';
    housingMode?: 'rent' | 'own';
  };
  baseProbabilityPerMonth?: number;
  modifiers?: {
    macroRegime?: Partial<Record<MacroRegime, number>>;
    difficulty?: Partial<Record<Difficulty, number>>;
  };
  severity?: {
    distribution: 'weighted' | 'fixed';
    outcomes: EventSeverityOutcome[];
  };
  interruptsHalfYearPacing?: boolean;
  choices?: EventChoiceDefinition[];
  cooldownMonths?: number;
  calibration?: {
    source: string;
    confidence: 'low' | 'medium' | 'high';
  };
}
