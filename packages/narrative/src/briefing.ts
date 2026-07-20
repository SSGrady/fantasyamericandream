import type { AuditSnapshot } from '@fad/shared';

/** Template-based briefing. LLM optional in V1. */
export function renderBriefingHeadline(audit: AuditSnapshot): string {
  const delta = audit.netWorthDelta;
  if (delta >= 0) {
    return `Net worth grew $${(delta / 100).toFixed(0)} over the last six months`;
  }
  return `Net worth fell $${(Math.abs(delta) / 100).toFixed(0)}. Here is what happened.`;
}
