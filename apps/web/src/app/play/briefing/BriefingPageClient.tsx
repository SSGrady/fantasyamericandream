'use client';

import { CA_ENGINEER_2026, formatChapterHeader, formatSimWindowRange, selectRibbonMetrics } from '@fad/domain';
import { netWorth } from '@fad/ledger';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { formatMoney } from '../../../lib/format-money';
import { usePlaySession } from '../../../lib/use-play-session';

export function BriefingPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession({ redirectTo: '/create/modules' });

  useEffect(() => {
    if (!ready || !session) return;
    if (session.currentAudit) {
      router.replace('/play/audit');
    }
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading briefing…
      </div>
    );
  }

  if (session.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Redirecting to chapter close…
      </div>
    );
  }

  const chapter = CA_ENGINEER_2026;
  const metrics = selectRibbonMetrics(session);
  const openingLabel = formatChapterHeader(session.chapterPeriod, session.periodIndex);
  const simWindow = formatSimWindowRange(session.chapterPeriod);
  const startNw = netWorth(session.gameState.accounts, session.gameState.debts);
  const liquidCents =
    session.gameState.accounts.checking.balance + session.gameState.accounts.hysa.balance;

  return (
    <div className="space-y-6">
      <MetricsRibbon
        metrics={metrics}
        heroKeys={['netWorth', 'emergencyRunwayMonths', 'savingsRate', 'cashSurplusRate']}
        showRunwayTooltip
        runwayBreakdown={{
          liquidCents,
          monthlyEssentialCents: session.gameState.location.rentPaymentMonthly,
        }}
      />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">{openingLabel}</p>
        <h2 className="mt-1 font-display text-2xl text-ink">Opening briefing · {session.chapterPeriod.openingDate}</h2>
        <p className="mt-2 text-sm text-muted">{chapter.briefingStakes}</p>
        <p className="mt-3 text-muted">
          {session.gameState.player.name}, you start as a {session.gameState.career.title} in{' '}
          {session.gameState.location.stateCode} on {session.chapterPeriod.openingDate}. Net worth is{' '}
          {formatMoney(startNw)} before the {simWindow} chapter runs.
        </p>
        <p className="mt-3 rounded-md bg-surface px-3 py-2 text-sm text-muted">
          Plan policies for {simWindow}, then live through the six-month simulation. Chapter close lands on{' '}
          {session.chapterPeriod.closingDate}.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/create/modules"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to module toggles
        </Link>
        <button
          type="button"
          onClick={() => router.push('/play/planning')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to planning
        </button>
      </div>
    </div>
  );
}
