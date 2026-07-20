import { assign, setup } from 'xstate';
import type { PlanningMode } from './planning-mode.js';

/** Four-stage chapter shell flow (ADR-014). */
export type ChapterStage =
  | 'openingBriefing'
  | 'planning'
  | 'simulating'
  | 'chapterClose';

/** @deprecated Legacy seven-route phases; map via legacyPhaseToStage. */
export type ChapterPhase =
  | 'briefing'
  | 'planning'
  | 'simulating'
  | 'consequence'
  | 'counterfactual'
  | 'audit'
  | 'dashboard';

export type ChapterCloseTab = 'story' | 'money' | 'whatIf' | 'voices' | 'lesson';

export interface ChapterContext {
  chapterIndex: number;
  stage: ChapterStage;
  closeTab: ChapterCloseTab;
  planningMode: PlanningMode;
}

export type ChapterEvent =
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'INTERRUPT' }
  | { type: 'RESUME' }
  | { type: 'SET_CLOSE_TAB'; tab: ChapterCloseTab };

const STAGE_ORDER: ChapterStage[] = [
  'openingBriefing',
  'planning',
  'simulating',
  'chapterClose',
];

export const chapterMachine = setup({
  types: {
    context: {} as ChapterContext,
    events: {} as ChapterEvent,
  },
}).createMachine({
  id: 'chapter',
  initial: 'openingBriefing',
  context: {
    chapterIndex: 0,
    stage: 'openingBriefing',
    closeTab: 'story',
    planningMode: 'initialPlan',
  },
  states: {
    openingBriefing: {
      on: { ADVANCE: { target: 'planning', actions: assign({ stage: 'planning' }) } },
    },
    planning: {
      on: {
        ADVANCE: { target: 'simulating', actions: assign({ stage: 'simulating' }) },
        BACK: { target: 'openingBriefing', actions: assign({ stage: 'openingBriefing' }) },
      },
    },
    simulating: {
      on: {
        ADVANCE: { target: 'chapterClose', actions: assign({ stage: 'chapterClose' }) },
        BACK: { target: 'planning', actions: assign({ stage: 'planning' }) },
        INTERRUPT: { target: 'planning', actions: assign({ stage: 'planning' }) },
      },
    },
    chapterClose: {
      on: {
        BACK: { target: 'simulating', actions: assign({ stage: 'simulating' }) },
        SET_CLOSE_TAB: {
          actions: assign(({ event }) =>
            event.type === 'SET_CLOSE_TAB' ? { closeTab: event.tab } : {},
          ),
        },
      },
    },
  },
});

export function nextChapterStage(stage: ChapterStage): ChapterStage | null {
  const index = STAGE_ORDER.indexOf(stage);
  if (index < 0 || index >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[index + 1] ?? null;
}

export function previousChapterStage(stage: ChapterStage): ChapterStage | null {
  const index = STAGE_ORDER.indexOf(stage);
  if (index <= 0) return null;
  return STAGE_ORDER[index - 1] ?? null;
}

export function legacyPhaseToStage(phase: ChapterPhase): ChapterStage {
  switch (phase) {
    case 'briefing':
      return 'openingBriefing';
    case 'planning':
      return 'planning';
    case 'simulating':
      return 'simulating';
    case 'consequence':
    case 'counterfactual':
    case 'audit':
    case 'dashboard':
      return 'chapterClose';
    default:
      return 'openingBriefing';
  }
}

export function stageToLegacyPhase(stage: ChapterStage): ChapterPhase {
  switch (stage) {
    case 'openingBriefing':
      return 'briefing';
    case 'planning':
      return 'planning';
    case 'simulating':
      return 'simulating';
    case 'chapterClose':
      return 'audit';
    default:
      return 'briefing';
  }
}

/** @deprecated Use nextChapterStage */
export function nextChapterPhase(phase: ChapterPhase): ChapterPhase | null {
  const stage = legacyPhaseToStage(phase);
  const next = nextChapterStage(stage);
  return next ? stageToLegacyPhase(next) : null;
}
