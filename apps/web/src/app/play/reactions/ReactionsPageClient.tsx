'use client';

import { renderStakeholderReactions } from '@fad/narrative';
import { useRouter } from 'next/navigation';
import { selectRibbonMetrics } from '@fad/domain';
import { usePlaySession } from '../../../lib/use-play-session';

export function ReactionsPageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading stakeholder reactions…
      </div>
    );
  }

  const audit = session.currentAudit;
  const metrics = selectRibbonMetrics(session);
  const reactions = renderStakeholderReactions(audit, {
    housingBurdenPct: metrics.housingBurdenPct,
    playerName: session.gameState.player.name,
    includePartner:
      session.gameState.household.maritalStatus !== 'single' &&
      session.gameState.household.partner !== undefined,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Stakeholder reactions</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Competing perspectives</h2>
        <p className="mt-3 text-muted">
          Partner, future self, labor market, and planner voices react to this period&apos;s audit
          deltas. Sentiment is template-driven, not random.
        </p>
      </div>

      <div className="space-y-3">
        {reactions.map((persona) => (
          <div
            key={persona.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{persona.name}</h3>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                {persona.sentiment}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{persona.note}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.push('/play/counterfactual')}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to counterfactual
        </button>
      </div>
    </div>
  );
}
