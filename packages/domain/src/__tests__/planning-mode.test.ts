import { describe, expect, it } from 'vitest';
import { resolvePlanningMode } from '../chapter/planning-mode.js';

describe('resolvePlanningMode', () => {
  it('uses interruptJobOffer when competing offer interrupt is active', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 3,
        acceptedOfferId: 'offer-sf-mid',
        activeInterrupt: {
          id: 'interrupt-offer',
          type: 'competing_offer',
          title: 'Competing offer',
          description: 'Recruiter deadline.',
          weight: 0.2,
        },
      }),
    ).toBe('interruptJobOffer');
  });

  it('uses initialPlan only when period 1 and no offer chosen yet', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 1,
        acceptedOfferId: null,
        activeInterrupt: null,
      }),
    ).toBe('initialPlan');
  });

  it('uses recurringPlan for chapter 2+ even without stored offer id', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 2,
        acceptedOfferId: null,
        activeInterrupt: null,
      }),
    ).toBe('recurringPlan');
  });

  it('uses recurringPlan when offer was chosen at onboarding', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 1,
        acceptedOfferId: 'offer-sf-mid',
        activeInterrupt: null,
      }),
    ).toBe('recurringPlan');
  });

  it('does not show job offers for non-competing interrupts', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 2,
        acceptedOfferId: 'offer-sf-mid',
        activeInterrupt: {
          id: 'interrupt-rto',
          type: 'return_to_office',
          title: 'RTO',
          description: 'Three days in office.',
          weight: 0.35,
        },
      }),
    ).toBe('recurringPlan');
  });
});
