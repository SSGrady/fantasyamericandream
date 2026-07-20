export { chapterMachine, nextChapterPhase } from './chapter/chapter-machine.js';
export type { ChapterContext, ChapterEvent, ChapterPhase } from './chapter/chapter-machine.js';
export { chapterPhaseRoute, routeChapterPhase } from './chapter/routing.js';
export { CA_ENGINEER_2026, getChapterDefinition } from './chapter/ca-engineer-2026.js';
export { evaluateChapterLessonUnlock } from './chapter/lesson-unlocks.js';
export {
  applyInterruptCapacityDelta,
  rollChapterInterrupt,
  type InterruptChoice,
} from './chapter/interrupts.js';
export type { ChapterDefinition, ChapterId, JobOffer, ChapterInterrupt } from './chapter/types.js';
