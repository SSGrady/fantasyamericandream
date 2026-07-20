'use client';

import { useRouter } from 'next/navigation';
import { formatMoney } from '../../../lib/format-money';
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

  const audit = session.currentAudit;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Impact analysis (stub)</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Fiscal and liquidity snapshot</h2>
        <p className="mt-3 text-muted">
          T012 will expand impact cards and Show the Math. This stub links forward using your
          current audit.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Net worth delta</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {formatMoney(audit.netWorthDelta, { signed: true })}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Savings rate</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {(audit.savingsRate * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Runway</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {Number.isFinite(audit.emergencyRunwayMonths)
              ? `${audit.emergencyRunwayMonths.toFixed(1)} mo`
              : '∞'}
          </p>
        </div>
      </div>

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
