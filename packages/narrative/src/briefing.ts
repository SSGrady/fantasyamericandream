import type { AuditSnapshot, SampledEventOccurrence } from '@fad/shared';

/** Template-based briefing. LLM optional in V1. */
export function renderBriefingHeadline(audit: AuditSnapshot): string {
  const delta = audit.netWorthDelta;
  const start = audit.startNetWorth;
  const end = audit.netWorth;
  if (delta >= 0) {
    return `Net worth grew $${(delta / 100).toFixed(0)} (${(start / 100).toFixed(0)} → ${(end / 100).toFixed(0)})`;
  }
  return `Net worth fell $${(Math.abs(delta) / 100).toFixed(0)} (${(start / 100).toFixed(0)} → ${(end / 100).toFixed(0)})`;
}

export function renderBriefingEventsSummary(events: SampledEventOccurrence[]): string {
  const notable = events.filter((event) => event.eventId !== 'quiet_month');
  if (notable.length === 0) {
    return 'Mostly quiet months. No major interrupts this period.';
  }

  const titles = [...new Set(notable.map((event) => event.title))];
  if (titles.length === 1) {
    return `Notable event: ${titles[0]}.`;
  }
  if (titles.length <= 3) {
    return `Notable events: ${titles.join(', ')}.`;
  }

  const preview = titles.slice(0, 3).join(', ');
  return `Notable events: ${preview}, and ${titles.length - 3} more.`;
}
