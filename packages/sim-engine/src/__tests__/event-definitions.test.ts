import { describe, expect, it } from 'vitest';
import {
  V0_STARTER_EVENT_DEFINITIONS,
  V0_STARTER_EVENT_IDS,
  assertEventRegistryComplete,
  getEventDefinition,
  listEventDefinitions,
} from '../index.js';

const EXPECTED_V0_EVENT_IDS = [
  'quiet_month',
  'rent_increase',
  'student_loan_grace_ends',
  'open_enrollment',
  '401k_match_available',
  'delivery_habit_drain',
  'layoff_warning',
  'layoff_executed',
  'job_offer',
  'ghost_job_loop',
  'medical_er_visit',
  'car_repair',
  'bonus_paid',
  'market_drawdown_mild',
  'market_rally',
  'credit_limit_increase_offer',
  'subscription_creep',
  'roommate_opportunity',
  'certification_opportunity',
  'promotion_review',
] as const;

describe('V0 event definitions', () => {
  it('registers all 20 starter events from event-schema.md', () => {
    expect(V0_STARTER_EVENT_DEFINITIONS).toHaveLength(20);
    expect(V0_STARTER_EVENT_IDS).toEqual([...EXPECTED_V0_EVENT_IDS]);
    expect(() => assertEventRegistryComplete(EXPECTED_V0_EVENT_IDS)).not.toThrow();
  });

  it('looks up definitions by id', () => {
    const layoff = getEventDefinition('layoff_executed');
    expect(layoff?.category).toBe('career');
    expect(layoff?.interruptsHalfYearPacing).toBe(true);
    expect(listEventDefinitions()).toHaveLength(20);
  });

  it('each definition has required schema fields', () => {
    for (const definition of V0_STARTER_EVENT_DEFINITIONS) {
      expect(definition.id).toBeTruthy();
      expect(definition.title).toBeTruthy();
      expect(definition.category).toBeTruthy();
    }
  });
});
