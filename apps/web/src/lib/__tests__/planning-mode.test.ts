import { describe, expect, it } from 'vitest';
import { resolvePlanningMode } from '@fad/domain';

describe('chapter planning mode', () => {
  it('chapter 2 planning does not use job offer picker mode', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 2,
        selectedJobOfferId: 'offer-sf-mid',
        activeInterrupt: null,
      }),
    ).toBe('recurringPlan');
  });

  it('onboarding offer prevents initialPlan on chapter 1', () => {
    expect(
      resolvePlanningMode({
        periodIndex: 1,
        selectedJobOfferId: 'offer-sf-mid',
        activeInterrupt: null,
      }),
    ).toBe('recurringPlan');
  });
});
