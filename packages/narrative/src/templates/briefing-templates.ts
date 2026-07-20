import type { AuditSnapshot, GameState } from '@fad/shared';
import { renderTemplate } from './engine.js';

function choiceDrivenCents(audit: AuditSnapshot): number {
  const savingsInflows = Math.round(audit.savingsRate * audit.periodNetPayCents);
  return savingsInflows;
}

function luckDrivenCents(audit: AuditSnapshot): number {
  const choice = choiceDrivenCents(audit);
  const total = audit.netWorthDelta;
  return total - choice;
}

export function renderEditorialHeadline(audit: AuditSnapshot, playerName: string): string {
  const luck = luckDrivenCents(audit);
  const choice = choiceDrivenCents(audit);
  const luckPct = audit.netWorthDelta !== 0 ? Math.round((Math.abs(luck) / Math.abs(audit.netWorthDelta)) * 100) : 0;

  if (audit.netWorthDelta >= 0 && luck > choice) {
    return renderTemplate(
      '{{name}}, markets carried the chapter: ${{deltaDollars}} net worth, mostly luck ({{luckPct}}%)',
      {
        name: playerName,
        deltaDollars: Math.round(audit.netWorthDelta / 100),
        luckPct,
      },
    );
  }

  if (audit.netWorthDelta >= 0) {
    return renderTemplate(
      '{{name}}, your choices held: savings and deferrals drove ${{deltaDollars}} this chapter',
      {
        name: playerName,
        deltaDollars: Math.round(audit.netWorthDelta / 100),
      },
    );
  }

  return renderTemplate(
    '{{name}}, tighter margins: net worth down ${{deltaDollars}} with runway at {{runway}} months',
    {
      name: playerName,
      deltaDollars: Math.abs(Math.round(audit.netWorthDelta / 100)),
      runway: audit.emergencyRunwayMonths.toFixed(1),
    },
  );
}

export function renderBriefingBullets(audit: AuditSnapshot, gameState: GameState): string[] {
  const bullets: string[] = [];
  const luck = luckDrivenCents(audit);
  const choice = choiceDrivenCents(audit);

  if (choice > 0) {
    bullets.push(
      `What helped: payroll savings and transfers added about ${Math.round(choice / 100)} dollars this chapter.`,
    );
  }
  if (luck > 0) {
    bullets.push(
      `What helped (luck): investment returns contributed about ${Math.round(luck / 100)} dollars beyond your savings rate.`,
    );
  } else if (luck < 0) {
    bullets.push(
      `What hurt: market losses offset about ${Math.abs(Math.round(luck / 100))} dollars of your progress.`,
    );
  }
  if (audit.emergencyRunwayMonths < 3) {
    bullets.push('Unresolved tension: runway under three months while rent and essentials keep climbing.');
  } else if (audit.savingsRate < 0.1) {
    bullets.push('Unresolved tension: savings rate below 10% while goals need consistent transfers.');
  } else {
    bullets.push(`Unresolved tension: ${gameState.career.title} comp is stable, but one shock could reset runway.`);
  }

  return bullets;
}

export function renderConsequenceSummary(audit: AuditSnapshot): string {
  const runway = audit.emergencyRunwayMonths.toFixed(1);
  const savingsPct = Math.round(audit.savingsRate * 100);
  return renderTemplate(
    'Runway {{runway}} months at {{savingsPct}}% savings rate. Returns and transfers are ledger-sourced.',
    { runway, savingsPct },
  );
}
