import type { AuditSnapshot, GameState } from './game-state.js';
import type { SampledEventOccurrence } from './sampled-event.js';

/** Structured simulation turn output for narrative and UI (no LLM arithmetic). */
export interface TurnResult {
  startDate: GameState['run']['currentDate'];
  endDate: GameState['run']['currentDate'];
  audit: AuditSnapshot;
  sampledEvents: SampledEventOccurrence[];
  playerAction?: string;
}
