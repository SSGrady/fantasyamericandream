'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BalanceSheetGrid } from '../../../components/play/BalanceSheetGrid';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { ProgressRings } from '../../../components/play/ProgressRings';
import { WaterfallList } from '../../../components/play/WaterfallList';
import { formatMoney } from '../../../lib/format-money';
import {
  applyChapterLessonUnlock,
  computeRibbonMetrics,
  detectAutomaticEndReason,
  endSimulation,
  isSimulationComplete,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function AuditPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();

  useEffect(() => {
    if (!session?.currentAudit || session.chapterLessonUnlock) return;
    const updated = applyChapterLessonUnlock(session);
    if (updated.chapterLessonUnlock !== session.chapterLessonUnlock) {
      setSession(updated);
    }
  }, [session, setSession]);

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading net-worth audit…
      </div>
    );
  }

  const audit = session.currentAudit;
  const metrics = computeRibbonMetrics(audit, session.gameState);
  const complete = isSimulationComplete(session);
  const autoEnd = detectAutomaticEndReason(session);
  const lessonUnlock = session.chapterLessonUnlock;

  const handleContinue = () => {
    if (autoEnd && !session.endReason) {
      const reason = autoEnd;
      const demoLimit = session.periodIndex >= session.maxPeriods && reason === 'voluntary';
      const next = endSimulation(session, reason, { demoLimit });
      setSession(next);
      router.push('/play/end');
      return;
    }

    if (complete) {
      router.push('/play/dashboard');
      return;
    }

    router.push('/play/dream-home');
  };

  return (
    <div className="space-y-8">
      <MetricsRibbon metrics={metrics} />

      {lessonUnlock ? (
        <div className="rounded-lg border border-positive/30 bg-positive/5 p-4 shadow-sm">
          <p className="text-sm font-medium text-positive">Lesson unlocked</p>
          <p className="mt-1 text-sm text-muted">
            {lessonUnlock.replace('_', ' ')} literacy track is now available on your dashboard.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Net worth</p>
          <p className="mt-1 text-xl font-semibold text-ink">{formatMoney(audit.netWorth)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Period change</p>
          <p className="mt-1 text-xl font-semibold text-ink">
            {formatMoney(audit.netWorthDelta, { signed: true })}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">As of</p>
          <p className="mt-1 text-xl font-semibold text-ink">{audit.asOf}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Balance sheet</h2>
        <BalanceSheetGrid accounts={session.gameState.accounts} debts={session.gameState.debts} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Net-worth waterfall</h2>
        <WaterfallList lines={audit.waterfall} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Change attribution</h2>
        {audit.attribution ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Your choices</p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {formatMoney(audit.attribution.choiceCents, { signed: true })}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Market luck</p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {formatMoney(audit.attribution.luckCents, { signed: true })}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Lifestyle leakage
              </p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {formatMoney(audit.attribution.lifestyleLeakageCents)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Attribution not available for this audit.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Contribution progress</h2>
        <p className="text-sm text-muted">
          Rings track tax-year contributions from ledger transactions. Roth balance breakdown
          separates starting balance, new contributions, and market returns.
        </p>
        <ProgressRings
          progress={audit.contributionProgress}
          rothIra={session.gameState.accounts.rothIra}
          startingRothBalance={session.startingRothBalance}
          rothMarketReturnsCents={audit.accountInvestmentReturns?.rothIra ?? 0}
        />
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.push('/play/counterfactual')}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to counterfactual
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          {autoEnd || complete ? 'View final report' : 'Browse DreamHome listings'}
        </button>
      </div>
    </div>
  );
}
