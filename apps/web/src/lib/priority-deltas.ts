import type { ChapterInterrupt } from '@fad/domain';
import type { LifePriorityId } from '@fad/shared';

export interface PriorityDelta {
  priority: LifePriorityId;
  delta: number;
}

const PRIORITY_LABELS: Record<LifePriorityId, string> = {
  wealth: 'Wealth',
  freedom: 'Freedom',
  stability: 'Stability',
  experience: 'Experience',
  family: 'Family',
};

/** Authored metadata for interrupt choices (not LLM). */
export function interruptChoiceDeltas(
  interrupt: ChapterInterrupt,
  choiceId: string,
): PriorityDelta[] {
  if (interrupt.type === 'return_to_office') {
    if (choiceId === 'accept-rto') {
      return [
        { priority: 'wealth', delta: 1 },
        { priority: 'freedom', delta: -2 },
        { priority: 'stability', delta: 1 },
      ];
    }
    if (choiceId === 'negotiate-hybrid') {
      return [
        { priority: 'wealth', delta: 0 },
        { priority: 'freedom', delta: -1 },
        { priority: 'stability', delta: 1 },
      ];
    }
  }
  if (interrupt.type === 'competing_offer') {
    return [
      { priority: 'wealth', delta: 2 },
      { priority: 'experience', delta: 1 },
      { priority: 'stability', delta: -1 },
    ];
  }
  if (interrupt.type === 'market_surprise') {
    return [
      { priority: 'wealth', delta: -2 },
      { priority: 'stability', delta: -1 },
    ];
  }
  return [];
}

export function planChoiceDeltas(action: 'commit_plan' | 'side_gig_up'): PriorityDelta[] {
  if (action === 'side_gig_up') {
    return [
      { priority: 'wealth', delta: 1 },
      { priority: 'freedom', delta: -1 },
    ];
  }
  return [
    { priority: 'stability', delta: 1 },
    { priority: 'wealth', delta: 1 },
  ];
}

export function filterDeltasForPriorities(
  deltas: PriorityDelta[],
  priorities: LifePriorityId[] | undefined,
): PriorityDelta[] {
  if (!priorities || priorities.length === 0) return [];
  const top = priorities.slice(0, 3);
  return deltas.filter((d) => top.includes(d.priority));
}

export function formatPriorityDelta(delta: PriorityDelta): string {
  const sign = delta.delta > 0 ? '+' : '';
  return `${PRIORITY_LABELS[delta.priority]} ${sign}${delta.delta}`;
}
