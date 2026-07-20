'use client';

import { renderBriefingHeadline, renderBriefingEventsSummary } from '@fad/narrative';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { formatMoney } from '../../../lib/format-money';
import {
  applyTickToSession,
  computeRibbonMetrics,
  formatChapterLabel,
  runSimTick,
  savePlaySession,
  type PlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function BriefingPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession({ redirectTo: '/create/modules' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !session) return;

    if (session.currentAudit) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function tick() {
      setLoading(true);
      setError(null);
      savePlaySession({ ...session!, tickInProgress: true });

      try {
        const result = await runSimTick({
          startDate: session!.gameState.run.currentDate,
          randomSeed: session!.gameState.run.randomSeed,
          accounts: session!.gameState.accounts,
          debts: session!.gameState.debts,
          career: session!.gameState.career,
          location: session!.gameState.location,
          household: session!.gameState.household,
          player: {
            habits: session!.gameState.player.habits,
            includeEmployerHealthPlan: session!.gameState.player.includeEmployerHealthPlan,
            ageYears: session!.gameState.player.ageYears,
          },
          macro: session!.gameState.macro,
          deferral401kRate: session!.deferral401kRate,
          difficulty: session!.gameState.run.difficulty,
          enabledModules: session!.gameState.run.enabledModules,
          activeCommands: session!.gameState.commandState?.activeCommands,
          weeklyCapacityHours: session!.gameState.commandState?.weeklyCapacityHours,
        });

        if (cancelled) return;
        const updated = applyTickToSession(session!, result);
        setSession(updated);
      } catch (tickError) {
        if (cancelled) return;
        savePlaySession({ ...session!, tickInProgress: false });
        setError(tickError instanceof Error ? tickError.message : 'Simulation failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void tick();

    return () => {
      cancelled = true;
    };
  }, [ready, session, setSession]);

  if (!ready || !session) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading briefing…
      </div>
    );
  }

  if (loading || !session.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        {error ?? 'Running six-month simulation…'}
      </div>
    );
  }

  const audit = session.currentAudit;
  const metrics = computeRibbonMetrics(audit, session.gameState);
  const headline = renderBriefingHeadline(audit);
  const eventsSummary = renderBriefingEventsSummary(session.periodEvents ?? []);
  const periodLabel = formatChapterLabel(audit.asOf, session.periodIndex - 1);

  return (
    <div className="space-y-6">
      <MetricsRibbon metrics={metrics} />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">{periodLabel}</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">{headline}</h2>
        <p className="mt-3 text-muted">
          {session.gameState.player.name}, your {session.gameState.career.title} role in{' '}
          {session.gameState.location.stateCode} closed this audit at {audit.asOf}. Starting net
          worth was {formatMoney(audit.startNetWorth)}; it is now {formatMoney(audit.netWorth)}.
          Savings rate measures payroll deferrals and transfers only, not investment returns.
        </p>
        <p className="mt-3 rounded-md bg-surface px-3 py-2 text-sm text-muted">{eventsSummary}</p>
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
          onClick={() => router.push('/play/decide')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to decision day
        </button>
      </div>
    </div>
  );
}
