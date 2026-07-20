'use client';

import { renderBriefingHeadline, renderBriefingEventsSummary, renderEditorialHeadline, renderBriefingBullets } from '@fad/narrative';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { MonthTimeline, chapterMonthsFromAsOf } from '../../../components/play/MonthTimeline';
import { formatMoney } from '../../../lib/format-money';
import {
  applyTickToSession,
  computeMetricBreakdown,
  computeRibbonMetrics,
  formatChapterLabel,
  runSimTick,
  savePlaySession,
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
  const breakdown = computeMetricBreakdown(audit, session.gameState);
  const headline = renderEditorialHeadline(audit, session.gameState.player.name);
  const legacyHeadline = renderBriefingHeadline(audit);
  const bullets = renderBriefingBullets(audit, session.gameState);
  const eventsSummary = renderBriefingEventsSummary(session.periodEvents ?? []);
  const periodLabel = formatChapterLabel(audit.asOf, session.periodIndex - 1);
  const months = chapterMonthsFromAsOf(audit.asOf);
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
          monthlyEssentialCents: breakdown.emergencyRunway.monthlyBurnCents,
        }}
      />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">{periodLabel}</p>
        <h2 className="mt-1 font-display text-2xl text-ink">{headline}</h2>
        <p className="mt-2 text-sm text-muted">{legacyHeadline}</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {bullets.map((bullet) => (
            <li key={bullet} className="rounded-md bg-surface px-3 py-2">
              {bullet}
            </li>
          ))}
        </ul>
        <MonthTimeline months={months} activeIndex={months.length - 1} />
        <p className="mt-3 text-muted">
          {session.gameState.player.name}, your {session.gameState.career.title} role in{' '}
          {session.gameState.location.stateCode} closed this audit at {audit.asOf}. Starting net
          worth was {formatMoney(audit.startNetWorth)}; it is now {formatMoney(audit.netWorth)}.
          Savings rate measures payroll deferrals and transfers only, not investment returns.
        </p>
        <p className="mt-3 rounded-md bg-surface px-3 py-2 text-sm text-muted">{eventsSummary}</p>
      </div>

      <aside className="sticky bottom-0 rounded-lg border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Chapter rail</p>
        <dl className="mt-2 grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-muted">Housing burden</dt>
            <dd className="font-medium text-ink">{(metrics.housingBurdenPct * 100).toFixed(0)}% of net pay</dd>
          </div>
          <div>
            <dt className="text-muted">DTI</dt>
            <dd className="font-medium text-ink">{(metrics.dti * 100).toFixed(0)}%</dd>
          </div>
          <div>
            <dt className="text-muted">Net pay / mo</dt>
            <dd className="font-medium text-ink">{formatMoney(metrics.takeHomePayMonthly)}</dd>
          </div>
        </dl>
      </aside>

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
