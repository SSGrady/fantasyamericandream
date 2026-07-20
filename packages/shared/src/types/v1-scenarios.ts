/** V1 starter scenario identifiers from user-journey.md */
export type V1StarterScenarioId =
  | 'class-of-2026'
  | 'non-target-climb'
  | 'tech-reset'
  | 'medical-road'
  | 'gig-economy'
  | 'create-your-own';

/** V1 tension tags for scenario cards. */
export type ScenarioTensionTag =
  | 'rent_squeeze'
  | 'layoff_sector'
  | 'debt_climb'
  | 'benefits_gap'
  | 'offer_season';

export interface V1StarterScenario {
  id: V1StarterScenarioId;
  title: string;
  tagline: string;
  description: string;
  /** Fantasy hook for scenario picker. */
  fantasyHook: string;
  tensionTag: ScenarioTensionTag;
  /** Authored difficulty 1 (gentle) to 5 (harsh). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Dashed card for custom character creator */
  isCustom?: boolean;
}

export const V1_STARTER_SCENARIOS: readonly V1StarterScenario[] = [
  {
    id: 'class-of-2026',
    title: 'Class of 2026',
    tagline: 'First job, first lease',
    fantasyHook: 'Three offers. One lease. Zero parental safety net.',
    tensionTag: 'offer_season',
    difficulty: 2,
    description:
      'Age 22, bachelor\'s degree, first full-time job, student debt, and a delivery habit.',
  },
  {
    id: 'non-target-climb',
    title: 'Non-Target Climb',
    tagline: 'Harder recruiting, upside via certs',
    fantasyHook: 'Prove the degree was not a mistake.',
    tensionTag: 'debt_climb',
    difficulty: 4,
    description:
      'Lower initial offers and tougher recruiting, with upside through certifications and persistence.',
  },
  {
    id: 'tech-reset',
    title: 'Tech Reset',
    tagline: 'High comp, layoff exposure',
    fantasyHook: 'Golden handcuffs meet hiring freeze headlines.',
    tensionTag: 'layoff_sector',
    difficulty: 3,
    description:
      'Strong compensation and equity upside, with elevated layoff risk in a volatile sector.',
  },
  {
    id: 'medical-road',
    title: 'Medical Road',
    tagline: 'Debt now, peak earnings later',
    fantasyHook: 'Delayed gratification on a decade-long clock.',
    tensionTag: 'debt_climb',
    difficulty: 4,
    description:
      'Heavy education debt, residency-level income, and delayed peak earnings on the path to practice.',
  },
  {
    id: 'gig-economy',
    title: 'Gig Economy Survival',
    tagline: 'No benefits, variable demand',
    fantasyHook: 'Every month is a new boss fight.',
    tensionTag: 'benefits_gap',
    difficulty: 5,
    description:
      'Variable income, no employer benefits, and survival through demand swings and self-funded safety nets.',
  },
  {
    id: 'create-your-own',
    title: 'Create Your Own',
    tagline: 'Full character creator',
    fantasyHook: 'Write your own opening chapter.',
    tensionTag: 'rent_squeeze',
    difficulty: 3,
    description: 'Build your own starting life from scratch.',
    isCustom: true,
  },
] as const;

export function getV1StarterScenario(id: V1StarterScenarioId): V1StarterScenario | undefined {
  return V1_STARTER_SCENARIOS.find((scenario) => scenario.id === id);
}
