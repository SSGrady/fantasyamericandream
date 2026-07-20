import type { EventCategory } from './event-definition.js';
import type { IsoDate } from './game-state.js';

/** Runtime event occurrence sampled during a simulation tick (narrative layer). */
export interface SampledEventOccurrence {
  eventId: string;
  title: string;
  category: EventCategory;
  monthIndex: number;
  monthKey: string;
  monthDate: IsoDate;
  severityId: string;
  interruptsHalfYearPacing: boolean;
}
