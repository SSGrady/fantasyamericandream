'use client';

import Link from 'next/link';
import { FinalReportPanel } from '../../../components/play/FinalReportPanel';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { clearPlaySession, computeRibbonMetrics } from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function EndPageClient() {
  const { session, ready } = usePlaySession({ redirectTo: '/play/dashboard' });

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading final report…
      </div>
    );
  }

  const metrics = computeRibbonMetrics(session.currentAudit, session.gameState);

  return (
    <div className="space-y-6">
      <MetricsRibbon metrics={metrics} />
      <FinalReportPanel session={session} />

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <Link
          href="/play/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to dashboard
        </Link>
        <Link
          href="/scenarios"
          onClick={() => clearPlaySession()}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Start a new scenario
        </Link>
      </div>
    </div>
  );
}
