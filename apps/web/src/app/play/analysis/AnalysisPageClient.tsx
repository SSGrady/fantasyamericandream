'use client';

import { useRouter } from 'next/navigation';
import { ImpactAnalysisCards } from '../../../components/play/ImpactAnalysisCards';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { formatMoney, formatPercent } from '../../../lib/format-money';
import {
  computeMetricBreakdown,
  computeRibbonMetrics,
  hasUnlockedSkill,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function AnalysisPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading impact analysis…
      </div>
    );
  }

  const preview = session.impactPreview;
  const audit = preview?.chosenAudit ?? session.currentAudit;
  const metrics = computeRibbonMetrics(audit, session.gameState);
  const breakdown = computeMetricBreakdown(audit, session.gameState);
  const emphasizeSavingsRate = hasUnlockedSkill(session, 'investing_i');

  return (
    <div className="space-y-6">
      <MetricsRibbon metrics={metrics} />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Impact analysis</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Baseline vs your choice</h2>
        <p className="mt-3 text-muted">
          Forward-looking six-month counterfactual with your submitted action applied. Same seed and
          macro path; only player-controlled knobs (e.g. 401(k) deferral) differ from baseline.
        </p>
      </div>

      {preview ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Net worth delta</p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {formatMoney(preview.deltaNetWorth, { signed: true })}
            </p>
            <p className="mt-1 text-sm text-muted">Chosen vs baseline after six months</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Runway delta</p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {preview.deltaRunwayMonths >= 0 ? '+' : ''}
              {preview.deltaRunwayMonths.toFixed(1)} mo
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Savings rate delta</p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {formatPercent(preview.deltaSavingsRate, { signed: true })}
            </p>
            <p className="mt-1 text-sm text-muted">
              Deferral {(preview.chosenDeferral401kRate * 100).toFixed(0)}% vs baseline{' '}
              {(session.deferral401kRate * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      ) : null}

      <ImpactAnalysisCards
        audit={audit}
        breakdown={breakdown}
        housingBurdenPct={metrics.housingBurdenPct}
        rothIra={session.gameState.accounts.rothIra}
        startingRothBalance={session.startingRothBalance}
        emphasizeSavingsRate={emphasizeSavingsRate}
      />

      {session.playerAction ? (
        <div className="rounded-lg border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted">
          Your action: {session.playerAction}
        </div>
      ) : null}

      <div className="flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.push('/play/reactions')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to reactions
        </button>
      </div>
    </div>
  );
}
