'use client';

import { renderDemoLimitCopy, renderEndReportCopy } from '@fad/narrative';
import type { PlaySession } from '../../lib/play-session';
import { formatMoney, formatPercent } from '../../lib/format-money';

interface FinalReportPanelProps {
  session: PlaySession;
}

function averageSavingsRate(session: PlaySession): number {
  if (session.periodHistory.length === 0) {
    return session.currentAudit?.savingsRate ?? 0;
  }
  const total = session.periodHistory.reduce((sum, entry) => sum + entry.savingsRate, 0);
  return total / session.periodHistory.length;
}

export function FinalReportPanel({ session }: FinalReportPanelProps) {
  const audit = session.currentAudit;
  if (!audit) return null;

  const copy = session.endedByDemoLimit
    ? renderDemoLimitCopy()
    : renderEndReportCopy(session.endReason ?? 'voluntary');
  const avgSavings = averageSavingsRate(session);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Final report</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">{copy.title}</h2>
        <p className="mt-3 text-muted">{copy.subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Ending net worth</p>
          <p className="mt-1 text-xl font-semibold text-ink">{formatMoney(audit.netWorth)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Avg savings rate</p>
          <p className="mt-1 text-xl font-semibold text-ink">{formatPercent(avgSavings)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Periods played</p>
          <p className="mt-1 text-xl font-semibold text-ink">{session.periodIndex}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Replay seed</p>
          <p className="mt-1 break-all font-mono text-xs text-ink">
            {session.gameState.run.randomSeed}
          </p>
        </div>
      </div>

      <p className="rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted">
        Same seed plus same choices replay this ledger path. Full counterfactual scoring ships
        in a later V1 slice.
      </p>
    </div>
  );
}
