import type {
  ActionCommand,
  AuditSnapshot,
  GameState,
  IsoDate,
  LiteracySkillId,
  LiteracyProgress,
  SampledEventOccurrence,
  SimulationEndReason,
} from '@fad/shared';
import type { ChapterId, ChapterInterrupt } from '../chapter/types.js';
import type { ChapterPhase } from '../chapter/chapter-machine.js';

export const RUN_STATE_SCHEMA_VERSION = 1 as const;

export type ChapterPeriodStatus = 'planned' | 'in_progress' | 'closed';

/** Calendar window for one six-month player chapter. */
export interface ChapterPeriod {
  openingDate: IsoDate;
  closingDate: IsoDate;
  status: ChapterPeriodStatus;
}

export interface ImpactPreview {
  baselineAudit: AuditSnapshot;
  chosenAudit: AuditSnapshot;
  deltaNetWorth: number;
  deltaRunwayMonths: number;
  deltaSavingsRate: number;
  chosenDeferral401kRate: number;
  /** True when baseline and chosen inputs produce identical outcomes. */
  isFlatPreview: boolean;
  flatPreviewReason?: string;
}

export interface PeriodHistoryEntry {
  periodIndex: number;
  asOf: AuditSnapshot['asOf'];
  startNetWorth: number;
  netWorth: number;
  netWorthDelta: number;
  savingsRate: number;
  emergencyRunwayMonths: number;
  playerAction?: string;
}

export interface PendingDecision {
  id: string;
  kind: 'required' | 'opportunity';
  title: string;
  description: string;
}

/** Authoritative client run model for play UI and persistence. */
export interface RunState {
  schemaVersion: typeof RUN_STATE_SCHEMA_VERSION;
  gameState: GameState;
  deferral401kRate: number;
  startingNetWorth: number;
  startingRothBalance: number;
  acceptedOfferId: string;
  /** Set true after first offer acceptance; blocks silent rewrites. */
  offerAccepted: boolean;
  chapterPeriod: ChapterPeriod;
  currentAudit: AuditSnapshot | null;
  impactPreview: ImpactPreview | null;
  impactPreviewCacheKey: string | null;
  commandDraft: ActionCommand[];
  commandCapacityError: string | null;
  pendingDecisions: PendingDecision[];
  playerAction: string;
  periodIndex: number;
  maxPeriods: number;
  tickInProgress: boolean;
  periodHistory: PeriodHistoryEntry[];
  endReason: SimulationEndReason | null;
  endedByDemoLimit: boolean;
  literacyQuizAnswered: boolean;
  literacyProgress: Record<LiteracySkillId, LiteracyProgress>;
  periodEvents: SampledEventOccurrence[];
  dreamHomeChoiceId: string | null;
  dreamHomeBlocked: boolean;
  chapterId: ChapterId;
  chapterPhase: ChapterPhase;
  activeInterrupt: ChapterInterrupt | null;
  chapterLessonUnlock: LiteracySkillId | null;
}
