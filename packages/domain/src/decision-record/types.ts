import type { IsoDate } from '@fad/shared';

export type DecisionActionType =
  | 'offer_accepted'
  | 'plan_committed'
  | 'interrupt_resolved'
  | 'commands_submitted';

/** Append-only player choice log for forensic replay. */
export interface DecisionRecord {
  id: string;
  timestamp: IsoDate;
  chapterNumber: number;
  actionType: DecisionActionType;
  /** SHA-256 of JSON-serialized payload for dedup. */
  payloadHash: string;
  payload: unknown;
  randomSeed: string;
}
