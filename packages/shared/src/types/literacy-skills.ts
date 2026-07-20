/** V0 literacy skill tree track IDs (stubs; unlock logic ships in V1). */
export type LiteracySkillId =
  | 'cash_flow_i'
  | 'emergency_readiness'
  | 'credit_debt'
  | 'workplace_benefits'
  | 'investing_i'
  | 'investing_ii'
  | 'housing'
  | 'transportation'
  | 'insurance'
  | 'taxes';

export type LiteracyMastery = 'locked' | 'in_progress' | 'mastered';

export interface LiteracyProgress {
  mastery: LiteracyMastery;
  quizAttempts: number;
  lastAssessedAt?: string;
}

export interface LiteracySkillDefinition {
  id: LiteracySkillId;
  title: string;
  track: string;
  unlocks: string[];
  v0Status: 'stub';
}

export const LITERACY_SKILL_STUBS: readonly LiteracySkillDefinition[] = [
  {
    id: 'cash_flow_i',
    title: 'Cash Flow I',
    track: 'Cash Flow',
    unlocks: ['Waterfall view', 'Subscription detector'],
    v0Status: 'stub',
  },
  {
    id: 'emergency_readiness',
    title: 'Emergency Readiness',
    track: 'Emergency',
    unlocks: ['Runway calculator'],
    v0Status: 'stub',
  },
  {
    id: 'credit_debt',
    title: 'Credit & Debt',
    track: 'Credit',
    unlocks: ['Debt optimizer', 'Refinance compare'],
    v0Status: 'stub',
  },
  {
    id: 'workplace_benefits',
    title: 'Workplace Benefits',
    track: 'Benefits',
    unlocks: ['Total comp analyzer'],
    v0Status: 'stub',
  },
  {
    id: 'investing_i',
    title: 'Investing I',
    track: 'Investing',
    unlocks: ['Portfolio builder', 'Rule of 72'],
    v0Status: 'stub',
  },
  {
    id: 'investing_ii',
    title: 'Investing II',
    track: 'Investing',
    unlocks: ['Tax-aware allocation', 'Monte Carlo band'],
    v0Status: 'stub',
  },
  {
    id: 'housing',
    title: 'Housing',
    track: 'Housing',
    unlocks: ['DreamHome gates', 'Rent vs buy stress test'],
    v0Status: 'stub',
  },
  {
    id: 'transportation',
    title: 'Transportation',
    track: 'Transportation',
    unlocks: ['True cost of ownership'],
    v0Status: 'stub',
  },
  {
    id: 'insurance',
    title: 'Insurance',
    track: 'Insurance',
    unlocks: ['Coverage gap map'],
    v0Status: 'stub',
  },
  {
    id: 'taxes',
    title: 'Taxes',
    track: 'Taxes',
    unlocks: ['Withholding projection'],
    v0Status: 'stub',
  },
] as const;

export function createDefaultLiteracyProgress(): Record<LiteracySkillId, LiteracyProgress> {
  const progress = {} as Record<LiteracySkillId, LiteracyProgress>;
  for (const skill of LITERACY_SKILL_STUBS) {
    progress[skill.id] = { mastery: 'locked', quizAttempts: 0 };
  }
  return progress;
}
