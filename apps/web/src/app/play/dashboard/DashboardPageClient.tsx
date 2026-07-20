'use client';

import Link from 'next/link';
import { formatMoney } from '../../../lib/format-money';
import { clearPlaySession } from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function DashboardPageClient() {
  const { session, ready } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading dashboard…
      </div>
    );
  }

  const audit = session.currentAudit;

  const handleNewRun = () => {
    clearPlaySession();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Final report (stub)</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">
          {session.periodIndex} six-month periods complete
        </h2>
        <p className="mt-3 text-muted">
          T012 will add scoring, timeline history, and skill tree unlocks. Your last audit net
          worth is {formatMoney(audit.netWorth)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/scenarios"
          onClick={handleNewRun}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Start a new scenario
        </Link>
        <Link
          href="/play/audit"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Review last audit
        </Link>
      </div>
    </div>
  );
}
