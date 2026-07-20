import type { AuditSnapshot } from '@fad/shared';
import { renderTemplate } from './engine.js';

export function renderEditorialHeadline(audit: AuditSnapshot, playerName: string): string {
  const delta = audit.netWorthDelta;
  const template =
    delta >= 0
      ? '{{name}} gained ground: net worth up ${{deltaDollars}} this chapter'
      : '{{name}} lost ground: net worth down ${{deltaDollars}} this chapter';
  return renderTemplate(template, {
    name: playerName,
    deltaDollars: Math.abs(Math.round(delta / 100)),
  });
}

export function renderConsequenceSummary(audit: AuditSnapshot): string {
  const runway = audit.emergencyRunwayMonths.toFixed(1);
  const savingsPct = Math.round(audit.savingsRate * 100);
  return renderTemplate(
    'Runway {{runway}} months at {{savingsPct}}% savings rate. Returns and transfers are ledger-sourced.',
    { runway, savingsPct },
  );
}
