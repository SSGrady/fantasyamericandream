'use client';

import { useRouter } from 'next/navigation';
import { ImpactAnalysisCards } from '../../../components/play/ImpactAnalysisCards';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { usePlaySession } from '../../../lib/use-play-session';
import { computeRibbonMetrics } from '../../../lib/play-session';

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

  const audit = session.currentAudit;
  const metrics = computeRibbonMetrics(audit, session.gameState);

  return (
    <div className="space-y-6">
      <MetricsRibbon metrics={metrics} />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Impact analysis</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Fiscal and liquidity snapshot</h2>
        <p className="mt-3 text-muted">
          Cards below come from your audit snapshot. Expand any card to see ledger waterfall lines.
        </p>
      </div>

      <ImpactAnalysisCards audit={audit} metrics={metrics} />

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
