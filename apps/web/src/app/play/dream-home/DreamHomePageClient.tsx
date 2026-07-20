'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  AffordabilityGates,
  ListingCard,
} from '../../../components/play/DreamHomePanel';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import {
  evaluateListingAffordability,
  generateDreamHomeListings,
  knowledgeModeFromHints,
} from '../../../lib/dream-home';
import { computeRibbonMetrics, savePlaySession } from '../../../lib/play-session';
import { loadOrCreateRunConfig } from '../../../lib/run-config';
import { usePlaySession } from '../../../lib/use-play-session';

export function DreamHomePageClient() {
  const router = useRouter();
  const { session, ready } = usePlaySession();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedChoice, setSavedChoice] = useState<string | null>(null);

  const runConfig = loadOrCreateRunConfig();
  const knowledgeMode = knowledgeModeFromHints(runConfig.hintsEnabled);

  const listings = useMemo(() => {
    if (!session?.currentAudit) return [];
    return generateDreamHomeListings(
      session.gameState,
      session.gameState.run.randomSeed,
      session.periodIndex,
    );
  }, [session]);

  const affordabilities = useMemo(
    () =>
      listings.map((listing) =>
        evaluateListingAffordability(listing, session!.gameState, knowledgeMode),
      ),
    [listings, session, knowledgeMode],
  );

  const selected =
    affordabilities.find((item) => item.listing.id === selectedId) ?? affordabilities[0] ?? null;

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading DreamHome window…
      </div>
    );
  }

  const metrics = computeRibbonMetrics(session.currentAudit, session.gameState);

  const handleContinue = () => {
    savePlaySession({
      ...session,
      dreamHomeChoiceId: selected?.listing.id ?? null,
      dreamHomeBlocked: selected?.blockedInGuardrails ?? false,
    });
    router.push('/play/dashboard');
  };

  const handleSaveBrowse = () => {
    if (!selected) return;
    if (selected.blockedInGuardrails) return;
    setSavedChoice(selected.listing.id);
    savePlaySession({
      ...session,
      dreamHomeChoiceId: selected.listing.id,
      dreamHomeBlocked: false,
    });
  };

  return (
    <div className="space-y-6">
      <MetricsRibbon metrics={metrics} />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">DreamHome window</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Ten synthetic listings near you</h2>
        <p className="mt-3 text-muted">
          Calibrated from your {session.gameState.location.stateCode} preference and income. Review
          PITI, cash to close, and five affordability gates before any offer.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {affordabilities.map((item) => (
            <ListingCard
              key={item.listing.id}
              affordability={item}
              selected={selected?.listing.id === item.listing.id}
              onSelect={() => setSelectedId(item.listing.id)}
            />
          ))}
        </div>

        {selected ? (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-ink">{selected.listing.address}</p>
              <p className="text-xs text-muted">
                List {formatListingPrice(selected.listing.priceCents)} · PITI{' '}
                {formatListingPrice(selected.pitiMonthlyCents)}/mo · Cash to close{' '}
                {formatListingPrice(selected.cashToCloseCents)}
              </p>
            </div>
            <AffordabilityGates affordability={selected} knowledgeMode={knowledgeMode} />
            {selected.blockedInGuardrails ? (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Guardrails mode blocks this purchase. Critical gates failed. Keep renting or pick a
                lower list price.
              </p>
            ) : null}
            {savedChoice === selected.listing.id ? (
              <p className="text-sm text-emerald-700">Saved as your browse choice (no ledger change in V1 lite).</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.push('/play/audit')}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to audit
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSaveBrowse}
            disabled={!selected || selected.blockedInGuardrails}
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent disabled:opacity-50"
          >
            Save browse choice
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            Continue to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function formatListingPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
