import { describe, expect, it } from 'vitest';
import {
  LITERACY_SKILL_STUBS,
  createDefaultLiteracyProgress,
  type LiteracySkillId,
} from '../types/literacy-skills.js';

const EXPECTED_SKILL_IDS: LiteracySkillId[] = [
  'cash_flow_i',
  'emergency_readiness',
  'credit_debt',
  'workplace_benefits',
  'investing_i',
  'investing_ii',
  'housing',
  'transportation',
  'insurance',
  'taxes',
];

describe('literacy skill stubs', () => {
  it('defines 10 V0 literacy skills from feature-set skill tree', () => {
    expect(LITERACY_SKILL_STUBS).toHaveLength(10);
    expect(LITERACY_SKILL_STUBS.map((skill) => skill.id)).toEqual(EXPECTED_SKILL_IDS);
  });

  it('creates locked default progress for every skill', () => {
    const progress = createDefaultLiteracyProgress();
    for (const id of EXPECTED_SKILL_IDS) {
      expect(progress[id].mastery).toBe('locked');
      expect(progress[id].quizAttempts).toBe(0);
    }
  });
});
