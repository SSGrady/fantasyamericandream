import type { EventDefinition } from '@fad/shared';
import { V1_MODULE_IDS } from '@fad/shared';

/** V2 household stub events (S006). */
export const V2_HOUSEHOLD_EVENT_DEFINITIONS: EventDefinition[] = [
  {
    id: 'divorce_warning_signs',
    title: 'Relationship Warning Signs',
    category: 'relationship',
    eligibility: {
      requiredModule: V1_MODULE_IDS.lifeDivorce,
      maritalStatus: ['partnered', 'married'],
      maxRelationshipHealth: 50,
    },
    baseProbabilityPerMonth: 0.02,
    modifiers: {
      difficulty: { hard: 1.2 },
    },
    severity: { distribution: 'fixed', outcomes: [{ id: 'warning', weight: 1 }] },
    interruptsHalfYearPacing: false,
    choices: [
      { id: 'counseling', label: 'Budget for couples counseling' },
      { id: 'ignore', label: 'Defer the conversation' },
    ],
    cooldownMonths: 6,
    calibration: { source: 'relationshipHealth threshold stub', confidence: 'low' },
  },
  {
    id: 'divorce_fallout_stub',
    title: 'Separation and Asset Division',
    category: 'legal',
    eligibility: {
      requiredModule: V1_MODULE_IDS.lifeDivorce,
      maritalStatus: ['partnered', 'married'],
      maxRelationshipHealth: 25,
    },
    baseProbabilityPerMonth: 0.008,
    severity: {
      distribution: 'weighted',
      outcomes: [
        { id: 'moderate', weight: 0.65 },
        { id: 'contested', weight: 0.35 },
      ],
    },
    interruptsHalfYearPacing: true,
    cooldownMonths: 36,
    calibration: { source: 'Asset split and alimony band stub', confidence: 'low' },
  },
];

export const V2_HOUSEHOLD_EVENT_IDS = V2_HOUSEHOLD_EVENT_DEFINITIONS.map((event) => event.id);
