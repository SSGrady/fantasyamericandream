'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RentalListingCard } from '../../../components/create/RentalListingCard';
import { loadCharacterDraft, saveCharacterDraft } from '../../../lib/character-draft';
import { initializePlaySession } from '../../../lib/play-session';
import { chapterShellPathWithStage } from '@fad/domain';
import {
  generateRentalListings,
  playerShareForListing,
  type RentalListing,
} from '../../../lib/rental-picker';
import { loadOrCreateRunConfig, saveRunConfig } from '../../../lib/run-config';
import type { V1CharacterDraft } from '@fad/shared';
import { formatMoney } from '../../../lib/format-money';

export function RentalPickerPageClient() {
  const router = useRouter();
  const [draft, setDraft] = useState<V1CharacterDraft | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadCharacterDraft();
    if (!loaded) {
      router.replace('/create');
      return;
    }
    setDraft(loaded);
    setSelectedId(loaded.rentalSelection?.listingId ?? null);
  }, [router]);

  const listings = useMemo(() => (draft ? generateRentalListings(draft) : []), [draft]);

  const selectedListing: RentalListing | null =
    listings.find((listing) => listing.id === selectedId) ?? listings[0] ?? null;

  const playerShare = selectedListing && draft ? playerShareForListing(selectedListing, draft) : 0;

  const handleBeginSimulation = () => {
    if (!draft || !selectedListing) return;

    const nextDraft: V1CharacterDraft = {
      ...draft,
      rentalSelection: {
        listingId: selectedListing.id,
        address: selectedListing.address,
        neighborhood: selectedListing.neighborhood,
        city: selectedListing.city,
        beds: selectedListing.beds,
        baths: selectedListing.baths,
        marketRentMonthly: selectedListing.marketRentMonthly,
      },
    };

    saveCharacterDraft(nextDraft);
    const config = loadOrCreateRunConfig();
    saveRunConfig(config);
    const session = initializePlaySession(nextDraft, config);
    router.push(
      chapterShellPathWithStage(session.gameState.run.id, 1, 'openingBriefing'),
    );
  };

  if (!draft) {
    return (
      <div className="rounded-xl bg-card p-6 text-muted ring-1 ring-border/60">
        Loading rental listings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card p-6 ring-1 ring-border/60">
        <p className="text-sm font-medium text-accent">Choose your lease</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Rental listings near {draft.stateCode}</h2>
        <p className="mt-3 text-sm text-muted">
          Pick a market-rate apartment before your first audit. Your housing arrangement splits the
          listed rent into the share you pay each month.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {listings.map((listing) => (
            <RentalListingCard
              key={listing.id}
              listing={listing}
              playerShareMonthly={playerShareForListing(listing, draft)}
              selected={selectedListing?.id === listing.id}
              onSelect={() => setSelectedId(listing.id)}
            />
          ))}
        </div>

        {selectedListing ? (
          <div className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-border/60 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Your lease</p>
              <p className="mt-1 text-lg font-semibold text-ink">{selectedListing.address}</p>
              <p className="text-sm text-muted">
                {selectedListing.neighborhood}, {selectedListing.city}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-xs text-muted">Market rent</dt>
                <dd className="font-medium text-ink">
                  {formatMoney(selectedListing.marketRentMonthly)}/mo
                </dd>
              </div>
              <div className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-xs text-muted">Your share</dt>
                <dd className="font-medium text-accent">{formatMoney(playerShare)}/mo</dd>
              </div>
              <div className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-xs text-muted">Layout</dt>
                <dd className="font-medium text-ink">
                  {selectedListing.beds} bd / {selectedListing.baths} ba
                </dd>
              </div>
              <div className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-xs text-muted">Size</dt>
                <dd className="font-medium text-ink">{selectedListing.sqft.toLocaleString()} sqft</dd>
              </div>
            </dl>
            <p className="text-sm text-muted">{selectedListing.flavor}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/create/job-offer"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to job offers
        </Link>
        <button
          type="button"
          onClick={handleBeginSimulation}
          disabled={!selectedListing}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          Begin simulation
        </button>
      </div>
    </div>
  );
}
