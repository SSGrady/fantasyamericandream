import { describe, expect, it } from 'vitest';
import {
  ALL_EVENT_DEFINITIONS,
  V0_STARTER_EVENT_DEFINITIONS,
  V0_STARTER_EVENT_IDS,
  V1_EXPANSION_EVENT_DEFINITIONS,
  V1_EXPANSION_EVENT_IDS,
  V2_HOUSEHOLD_EVENT_DEFINITIONS,
  V2_HOUSEHOLD_EVENT_IDS,
  assertEventRegistryComplete,
  getEventDefinition,
  listEventDefinitions,
  rollEventsForPeriod,
  rollEventsForMonth,
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

const EXPECTED_V1_EVENT_IDS = [
  'return_to_office_mandate',
  'rent_surge',
  'wedding_invitation',
  'side_gig_opportunity',
  'tax_refund_arrives',
  'grocery_inflation_shock',
  'auto_insurance_renewal',
  'passed_over_for_raise',
  'burnout_warning',
  'mortgage_rate_spike',
  'roommate_moves_out',
  'phishing_scam_attempt',
  'parental_leave_stub',
] as const;

const EXPECTED_V2_EVENT_IDS = ['divorce_warning_signs', 'divorce_fallout_stub'] as const;

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
  });

  it('each definition has required schema fields', () => {
    for (const definition of V0_STARTER_EVENT_DEFINITIONS) {
      expect(definition.id).toBeTruthy();
      expect(definition.title).toBeTruthy();
      expect(definition.category).toBeTruthy();
    }
  });
});

describe('V1 event expansion', () => {
  it('registers 13 additional V1 events for 35 total with V2 stubs', () => {
    expect(V1_EXPANSION_EVENT_DEFINITIONS).toHaveLength(13);
    expect(V1_EXPANSION_EVENT_IDS).toEqual([...EXPECTED_V1_EVENT_IDS]);
    expect(V2_HOUSEHOLD_EVENT_DEFINITIONS).toHaveLength(2);
    expect(V2_HOUSEHOLD_EVENT_IDS).toEqual([...EXPECTED_V2_EVENT_IDS]);
    expect(ALL_EVENT_DEFINITIONS).toHaveLength(35);
    expect(listEventDefinitions()).toHaveLength(35);
  });

  it('samples events deterministically for a fixed seed', () => {
    const events = rollEventsForPeriod({
      startDate: '2026-07-01',
      months: 6,
      randomSeed: 'event-roll-test',
      career: {
        sector: 'tech',
        title: 'Engineer',
        employmentType: 'w2',
        baseSalaryAnnual: 120_000_00,
        tenureMonths: 12,
        unemploymentWeeks: 0,
      },
      location: {
        stateCode: 'CA',
        metroId: 'sf',
        housingMode: 'rent',
        marketRentMonthly: 2_800_00,
        rentPaymentMonthly: 2_800_00,
      },
      macro: {
        regime: 'expansion',
        inflationAnnual: 0.025,
        sp500ReturnYtd: 0,
        mortgageRate30y: 0.065,
        layoffClimate: 0.8,
      },
      difficulty: 'medium',
    });

    const repeat = rollEventsForPeriod({
      startDate: '2026-07-01',
      months: 6,
      randomSeed: 'event-roll-test',
      career: {
        sector: 'tech',
        title: 'Engineer',
        employmentType: 'w2',
        baseSalaryAnnual: 120_000_00,
        tenureMonths: 12,
        unemploymentWeeks: 0,
      },
      location: {
        stateCode: 'CA',
        metroId: 'sf',
        housingMode: 'rent',
        marketRentMonthly: 2_800_00,
        rentPaymentMonthly: 2_800_00,
      },
      macro: {
        regime: 'expansion',
        inflationAnnual: 0.025,
        sp500ReturnYtd: 0,
        mortgageRate30y: 0.065,
        layoffClimate: 0.8,
      },
      difficulty: 'medium',
    });

    expect(events.length).toBeGreaterThan(0);
    expect(events).toEqual(repeat);
  });

  it('gates divorce events on module toggle and relationship health', () => {
    const context = {
      monthIndex: 0,
      monthKey: '2026-07',
      startDate: '2026-07-01' as const,
      randomSeed: 'divorce-module-test',
      career: {
        sector: 'tech' as const,
        title: 'Engineer',
        employmentType: 'w2' as const,
        baseSalaryAnnual: 120_000_00,
        tenureMonths: 24,
        unemploymentWeeks: 0,
      },
      location: {
        stateCode: 'NY' as const,
        metroId: 'new_york_city',
        housingMode: 'rent' as const,
        marketRentMonthly: 2_800_00,
        rentPaymentMonthly: 1_400_00,
      },
      macro: {
        regime: 'expansion' as const,
        inflationAnnual: 0.025,
        sp500ReturnYtd: 0,
        mortgageRate30y: 0.065,
        layoffClimate: 0.8,
      },
      difficulty: 'medium' as const,
      cooldowns: new Map<string, number>(),
      household: {
        maritalStatus: 'married' as const,
        relationshipHealth: 20,
      },
    };
    let call = 0;
    const skipQuietThenAlwaysRoll = () => {
      call += 1;
      if (call === 1) return 0.99;
      return 0;
    };

    const withModule = rollEventsForMonth(
      { ...context, enabledModules: ['life.divorce'] },
      skipQuietThenAlwaysRoll,
    );
    call = 0;
    const withoutModule = rollEventsForMonth(
      { ...context, enabledModules: [] },
      skipQuietThenAlwaysRoll,
    );

    const divorceIds = new Set(['divorce_warning_signs', 'divorce_fallout_stub']);
    expect(withModule.some((event) => divorceIds.has(event.eventId))).toBe(true);
    expect(withoutModule.some((event) => divorceIds.has(event.eventId))).toBe(false);
  });
});
