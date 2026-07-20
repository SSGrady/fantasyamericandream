'use client';

import { CA_ENGINEER_2026, deferralRateFromOffer, resolveJobOffer } from '@fad/domain';
import {
  centsToDollars,
  dollarsToCents,
  type V1CharacterDraft,
  type V1JobOfferSelection,
} from '@fad/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { JobOfferPicker } from '../../../components/create/JobOfferPicker';
import { loadCharacterDraft, saveCharacterDraft } from '../../../lib/character-draft';

const DEFAULT_CUSTOM = {
  employer: '',
  title: 'Software Engineer',
  baseSalaryAnnual: 140_000_00,
  commuteMinutes: 30,
  remoteDaysPerWeek: 3,
};

export function JobOfferPageClient() {
  const router = useRouter();
  const [draft, setDraft] = useState<V1CharacterDraft | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    CA_ENGINEER_2026.defaultOfferId,
  );
  const [custom, setCustom] = useState(DEFAULT_CUSTOM);

  const chapter = CA_ENGINEER_2026;
  const offers = chapter.jobOffers;
  const isCustom = selectedOfferId === 'custom';

  useEffect(() => {
    const loaded = loadCharacterDraft();
    if (!loaded) {
      router.replace('/create');
      return;
    }
    setDraft(loaded);
    if (loaded.jobOfferSelection) {
      setSelectedOfferId(loaded.jobOfferSelection.offerId);
      if (loaded.jobOfferSelection.custom) {
        setCustom(loaded.jobOfferSelection.custom);
      }
    }
  }, [router]);

  const resolvedOffer = useMemo(
    () =>
      resolveJobOffer(chapter, selectedOfferId, isCustom ? custom : undefined),
    [chapter, selectedOfferId, isCustom, custom],
  );

  const handleContinue = () => {
    if (!draft) return;

    const selection: V1JobOfferSelection = isCustom
      ? { offerId: 'custom', custom: { ...custom } }
      : { offerId: selectedOfferId };

    const nextDraft: V1CharacterDraft = {
      ...draft,
      jobOfferSelection: selection,
    };
    saveCharacterDraft(nextDraft);
    router.push('/create/modules');
  };

  if (!draft) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading job offers…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Onboarding · Step 3</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Choose your job offer</h2>
        <p className="mt-3 text-sm text-muted">
          Three W2 offers landed in your inbox. This choice sets salary, commute, and 401(k) match
          for your starting role. You will not re-pick each chapter unless a competing offer
          interrupt fires.
        </p>
      </div>

      <JobOfferPicker
        offers={offers}
        selectedOfferId={selectedOfferId}
        onSelect={setSelectedOfferId}
        customSelected={isCustom}
      />

      {isCustom ? (
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="font-serif text-lg text-ink">Custom offer terms</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-ink">Employer</span>
              <input
                type="text"
                value={custom.employer}
                onChange={(event) => setCustom({ ...custom, employer: event.target.value })}
                placeholder="Acme Corp"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Title</span>
              <input
                type="text"
                value={custom.title}
                onChange={(event) => setCustom({ ...custom, title: event.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Base salary (annual)</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-muted">$</span>
                <input
                  type="number"
                  min={40_000}
                  step={1000}
                  value={centsToDollars(custom.baseSalaryAnnual) || ''}
                  onChange={(event) =>
                    setCustom({
                      ...custom,
                      baseSalaryAnnual: dollarsToCents(Number(event.target.value) || 0),
                    })
                  }
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-ink"
                />
              </div>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Remote days per week</span>
              <input
                type="number"
                min={0}
                max={5}
                value={custom.remoteDaysPerWeek}
                onChange={(event) =>
                  setCustom({
                    ...custom,
                    remoteDaysPerWeek: Math.min(5, Math.max(0, Number(event.target.value) || 0)),
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-ink">Commute (minutes, one way)</span>
              <input
                type="number"
                min={0}
                max={120}
                value={custom.commuteMinutes}
                onChange={(event) =>
                  setCustom({
                    ...custom,
                    commuteMinutes: Math.max(0, Number(event.target.value) || 0),
                  })
                }
                className="mt-1 w-full max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-ink"
              />
            </label>
          </div>
        </section>
      ) : null}

      <div className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
        Selected: {resolvedOffer.employer} · {resolvedOffer.title} · suggested 401(k) deferral{' '}
        {(deferralRateFromOffer(resolvedOffer) * 100).toFixed(0)}%
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/create"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to character setup
        </Link>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Continue to module toggles
        </button>
      </div>
    </div>
  );
}
