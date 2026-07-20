import { assign, setup } from 'xstate';

export type ChapterPhase =
  | 'briefing'
  | 'planning'
  | 'simulating'
  | 'consequence'
  | 'counterfactual'
  | 'audit'
  | 'dashboard';

export interface ChapterContext {
  chapterIndex: number;
  phase: ChapterPhase;
}

export type ChapterEvent =
  | { type: 'ADVANCE' }
  | { type: 'INTERRUPT' }
  | { type: 'RESUME' };

const PHASE_ORDER: ChapterPhase[] = [
  'briefing',
  'planning',
  'simulating',
  'consequence',
  'counterfactual',
  'audit',
  'dashboard',
];

export const chapterMachine = setup({
  types: {
    context: {} as ChapterContext,
    events: {} as ChapterEvent,
  },
}).createMachine({
  id: 'chapter',
  initial: 'briefing',
  context: { chapterIndex: 0, phase: 'briefing' },
  states: {
    briefing: {
      on: { ADVANCE: { target: 'planning', actions: assign({ phase: 'planning' }) } },
    },
    planning: {
      on: { ADVANCE: { target: 'simulating', actions: assign({ phase: 'simulating' }) } },
    },
    simulating: {
      on: {
        ADVANCE: { target: 'consequence', actions: assign({ phase: 'consequence' }) },
        INTERRUPT: { target: 'planning', actions: assign({ phase: 'planning' }) },
      },
    },
    consequence: {
      on: { ADVANCE: { target: 'counterfactual', actions: assign({ phase: 'counterfactual' }) } },
    },
    counterfactual: {
      on: { ADVANCE: { target: 'audit', actions: assign({ phase: 'audit' }) } },
    },
    audit: {
      on: { ADVANCE: { target: 'dashboard', actions: assign({ phase: 'dashboard' }) } },
    },
    dashboard: {
      type: 'final',
    },
  },
});

export function nextChapterPhase(phase: ChapterPhase): ChapterPhase | null {
  const index = PHASE_ORDER.indexOf(phase);
  if (index < 0 || index >= PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[index + 1] ?? null;
}
