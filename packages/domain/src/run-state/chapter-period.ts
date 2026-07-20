import type { IsoDate } from '@fad/shared';
import type { ChapterPeriod, ChapterPeriodStatus } from './types.js';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function toIsoDate(date: Date): IsoDate {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}` as IsoDate;
}

/** Six-month chapter window: opening anchor (Jan 1) through chapter close (Jul 31). */
export function buildChapterPeriod(openingDate: IsoDate, status: ChapterPeriodStatus = 'planned'): ChapterPeriod {
  const opening = new Date(`${openingDate}T00:00:00Z`);
  const closing = new Date(opening);
  closing.setUTCMonth(closing.getUTCMonth() + 7, 0);
  return {
    openingDate,
    closingDate: toIsoDate(closing),
    status,
  };
}

/** Sim/policy window label (Feb-Jul when opening is Jan 1). */
export function formatSimWindowRange(period: ChapterPeriod): string {
  const planStart = new Date(`${period.openingDate}T00:00:00Z`);
  planStart.setUTCMonth(planStart.getUTCMonth() + 1);
  const close = new Date(`${period.closingDate}T00:00:00Z`);
  const startLabel = `${MONTH_NAMES[planStart.getUTCMonth()]} ${planStart.getUTCFullYear()}`;
  const endLabel = `${MONTH_NAMES[close.getUTCMonth()]} ${close.getUTCFullYear()}`;
  return `${startLabel}-${endLabel}`;
}

export function formatPeriodRange(period: ChapterPeriod): string {
  const open = new Date(`${period.openingDate}T00:00:00Z`);
  const close = new Date(`${period.closingDate}T00:00:00Z`);
  const startLabel = `${MONTH_NAMES[open.getUTCMonth()]} ${open.getUTCFullYear()}`;
  const endLabel = `${MONTH_NAMES[close.getUTCMonth()]} ${close.getUTCFullYear()}`;
  return `${startLabel}-${endLabel}`;
}

export function formatChapterHeader(period: ChapterPeriod, chapterIndex: number): string {
  return `Chapter ${chapterIndex + 1}: ${formatPeriodRange(period)}`;
}

export function canAccessPlanning(status: ChapterPeriodStatus): boolean {
  return status === 'planned';
}

export function canAccessOpeningBriefing(status: ChapterPeriodStatus, hasAudit: boolean): boolean {
  return status === 'planned' && !hasAudit;
}

export function isPeriodClosed(status: ChapterPeriodStatus): boolean {
  return status === 'closed';
}
