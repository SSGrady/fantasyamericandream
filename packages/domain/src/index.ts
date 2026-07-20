export type { ChapterCloseTab, ChapterContext, ChapterEvent, ChapterPhase, ChapterStage } from './chapter/chapter-machine.js';
export { chapterMachine, legacyPhaseToStage, nextChapterPhase, nextChapterStage, previousChapterStage, stageToLegacyPhase } from './chapter/chapter-machine.js';
export { chapterShellPath, chapterShellPathWithStage, legacyRouteToShell, chapterPhaseRoute, routeChapterPhase } from './chapter/routing.js';
export { appendDecisionRecord, createDecisionRecord, hashDecisionPayload } from './decision-record/append.js';
export type { DecisionActionType, DecisionRecord } from './decision-record/types.js';
export { CA_ENGINEER_2026, getChapterDefinition } from './chapter/ca-engineer-2026.js';
export { chapterSimMonthLabels, interruptMonthIndex } from './chapter/timeline.js';
export { evaluateChapterLessonUnlock } from './chapter/lesson-unlocks.js';
export {
  applyInterruptCapacityDelta,
  rollChapterInterrupt,
  type InterruptChoice,
} from './chapter/interrupts.js';
export { resolvePlanningMode, type PlanningMode, type PlanningModeInput } from './chapter/planning-mode.js';
export {
  deferralRateFromOffer,
  resolveJobOffer,
  type JobOfferOverrides,
} from './chapter/job-offer.js';
export type { ChapterDefinition, ChapterId, JobOffer, ChapterInterrupt } from './chapter/types.js';
export {
  buildChapterPeriod,
  canAccessOpeningBriefing,
  canAccessPlanning,
  formatChapterHeader,
  formatPeriodRange,
  formatSimWindowRange,
  isPeriodClosed,
} from './run-state/chapter-period.js';
export type {
  ChapterPeriod,
  ChapterPeriodStatus,
  ImpactPreview,
  PendingDecision,
  PeriodHistoryEntry,
  RunState,
} from './run-state/types.js';
export { RUN_STATE_SCHEMA_VERSION } from './run-state/types.js';
export {
  selectCanonicalAudit,
  selectChoiceAttribution,
  selectContributionProgress,
  selectLiquidRunway,
  selectNetWorth,
  selectRibbonMetrics,
  type RibbonMetrics,
} from './selectors/metrics.js';
export { selectLifeRailData, type LifeRailData, type LifeRailThread } from './selectors/life-rail.js';
