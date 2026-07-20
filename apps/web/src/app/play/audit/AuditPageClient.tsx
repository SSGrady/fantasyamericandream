'use client';

import { useRouter } from 'next/navigation';
import { BalanceSheetGrid } from '../../../components/play/BalanceSheetGrid';
import { ProgressRings } from '../../../components/play/ProgressRings';
import { WaterfallList } from '../../../components/play/WaterfallList';
import { formatMoney } from '../../../lib/format-money';
import {
  isSimulationComplete,
  savePlaySession,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function AuditPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading net-worth audit…
      </div>
    );
  }

  const audit = session.currentAudit;
  const complete = isSimulationComplete(session);

  const handleContinue = () => {
    if (complete) {
      router.push('/play/dashboard');
      return;
    }

    savePlaySession({
      ...session,
      currentAudit: null,
      pendingDecisions: [],
      playerAction: '',
    });
    router.push('/play/briefing');
  };

  return (
    <div className="space-y-8">
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
        <h2 className="font-serif text-xl text-ink">Contribution progress</h2>
        <ProgressRings progress={audit.contributionProgress} />
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.push('/play/reactions')}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to reactions
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          {complete ? 'View final report stub' : 'Continue to next briefing'}
        </button>
      </div>
    </div>
  );
}
