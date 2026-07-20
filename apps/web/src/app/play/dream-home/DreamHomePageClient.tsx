'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  AffordabilityGates,
  ListingCard,
} from '../../../components/play/DreamHomePanel';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import {
  DREAM_HOME_BUCKET_LABELS,
  evaluateListingAffordability,
  generateDreamHomeListings,
  knowledgeModeFromHints,
  type DreamHomeBucket,
} from '../../../lib/dream-home';
import { formatMoney } from '../../../lib/format-money';
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

  const byBucket = useMemo(() => {
    const groups = new Map<DreamHomeBucket, typeof affordabilities>();
    for (const item of affordabilities) {
      const bucket = item.listing.bucket;
      const list = groups.get(bucket) ?? [];
      list.push(item);
      groups.set(bucket, list);
    }
    return groups;
  }, [affordabilities]);

  const selected =
    affordabilities.find((item) => item.listing.id === selectedId) ?? affordabilities[0] ?? null;

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-xl bg-card p-6 text-muted ring-1 ring-border/60">
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

      <div className="rounded-xl bg-card p-6 ring-1 ring-border/60">
        <p className="text-sm font-medium text-accent">DreamHome window</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Aspiration ladder by time horizon</h2>
        <p className="mt-3 text-sm text-muted">
          Ten listings grouped into plausible now, 1-3 year, stretch, and dream buckets. Calibrated
          from your {session.gameState.location.stateCode} preference and income.
        </p>
      </div>

      <div className="space-y-8">
        {(['plausible_now', 'one_to_three_yr', 'stretch', 'dream'] as DreamHomeBucket[]).map(
          (bucket) => {
            const bucketListings = byBucket.get(bucket) ?? [];
            if (bucketListings.length === 0) return null;
            return (
              <section key={bucket} className="space-y-3">
                <h3 className="font-serif text-lg text-ink">{DREAM_HOME_BUCKET_LABELS[bucket]}</h3>
                <div className="grid gap-3 lg:grid-cols-2">
                  {bucketListings.map((item) => (
                    <ListingCard
                      key={item.listing.id}
                      affordability={item}
                      selected={selected?.listing.id === item.listing.id}
                      onSelect={() => setSelectedId(item.listing.id)}
                    />
                  ))}
                </div>
              </section>
            );
          },
        )}
      </div>

      {selected ? (
        <div className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-border/60">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Selected home</p>
            <p className="mt-1 text-lg font-semibold text-ink">{selected.listing.address}</p>
            <p className="text-sm text-muted">
              {DREAM_HOME_BUCKET_LABELS[selected.listing.bucket]} · List{' '}
              {formatMoney(selected.listing.priceCents)} · PITI{' '}
              {formatMoney(selected.pitiMonthlyCents)}/mo · Cash to close{' '}
              {formatMoney(selected.cashToCloseCents)}
            </p>
          </div>
          <AffordabilityGates affordability={selected} knowledgeMode={knowledgeMode} />
          {selected.blockedInGuardrails ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Guardrails mode blocks this purchase. Critical gates failed. Keep renting or pick a
              lower list price.
            </p>
          ) : null}
          {savedChoice === selected.listing.id ? (
            <p className="text-sm text-emerald-700">
              Saved as your browse choice (no ledger change in V1 lite).
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
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
