/** V1 starter scenario identifiers from user-journey.md */
export type V1StarterScenarioId =
  | 'class-of-2026'
  | 'non-target-climb'
  | 'tech-reset'
  | 'medical-road'
  | 'gig-economy'
  | 'create-your-own';

export interface V1StarterScenario {
  id: V1StarterScenarioId;
  title: string;
  tagline: string;
  description: string;
  /** Dashed card for custom character creator */
  isCustom?: boolean;
}

export const V1_STARTER_SCENARIOS: readonly V1StarterScenario[] = [
  {
    id: 'class-of-2026',
    title: 'Class of 2026',
    tagline: 'First job, first lease',
    description:
      'Age 22, bachelor\'s degree, first full-time job, student debt, and a delivery habit.',
  },
  {
    id: 'non-target-climb',
    title: 'Non-Target Climb',
    tagline: 'Harder recruiting, upside via certs',
    description:
      'Lower initial offers and tougher recruiting, with upside through certifications and persistence.',
  },
  {
    id: 'tech-reset',
    title: 'Tech Reset',
    tagline: 'High comp, layoff exposure',
    description:
      'Strong compensation and equity upside, with elevated layoff risk in a volatile sector.',
  },
  {
    id: 'medical-road',
    title: 'Medical Road',
    tagline: 'Debt now, peak earnings later',
    description:
      'Heavy education debt, residency-level income, and delayed peak earnings on the path to practice.',
  },
  {
    id: 'gig-economy',
    title: 'Gig Economy Survival',
    tagline: 'No benefits, variable demand',
    description:
      'Variable income, no employer benefits, and survival through demand swings and self-funded safety nets.',
  },
  {
    id: 'create-your-own',
    title: 'Create Your Own',
    tagline: 'Full character creator',
    description: 'Build your own starting life from scratch.',
    isCustom: true,
  },
] as const;

export function getV1StarterScenario(id: V1StarterScenarioId): V1StarterScenario | undefined {
  return V1_STARTER_SCENARIOS.find((scenario) => scenario.id === id);
}
