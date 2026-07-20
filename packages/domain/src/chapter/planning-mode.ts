import type { ChapterInterrupt } from './types.js';

export type PlanningMode = 'initialPlan' | 'recurringPlan' | 'interruptJobOffer';

export interface PlanningModeInput {
  periodIndex: number;
  selectedJobOfferId: string | null;
  activeInterrupt: ChapterInterrupt | null;
}

/** Derive planning UI mode from session state. Job offers repeat only on interrupt. */
export function resolvePlanningMode(input: PlanningModeInput): PlanningMode {
  if (input.activeInterrupt?.type === 'competing_offer') {
    return 'interruptJobOffer';
  }
  if (input.periodIndex <= 1 && !input.selectedJobOfferId) {
    return 'initialPlan';
  }
  return 'recurringPlan';
}
