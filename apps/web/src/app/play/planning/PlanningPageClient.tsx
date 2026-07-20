'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { JobOffer } from '@fad/domain';
import { CA_ENGINEER_2026 } from '@fad/domain';
import { formatMoney } from '../../../lib/format-money';
import { savePlaySession } from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function PlanningPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const chapter = CA_ENGINEER_2026;
  const offers = chapter.jobOffers;

  useEffect(() => {
    if (session?.gameState.career.title) {
      const match = offers.find((o) => o.title === session.gameState.career.title);
      if (match) setSelectedOfferId(match.id);
    }
  }, [session, offers]);

  const selectedOffer: JobOffer | null =
    offers.find((o) => o.id === selectedOfferId) ?? offers[0] ?? null;

  const handleContinue = () => {
    if (!session || !selectedOffer) return;
    const next = {
      ...session,
      gameState: {
        ...session.gameState,
        career: {
          ...session.gameState.career,
          title: selectedOffer.title,
          baseSalaryAnnual: selectedOffer.baseSalaryAnnual,
        },
      },
      deferral401kRate: Math.min(0.1, selectedOffer.deferral401kMatchPct + 0.06),
    };
    savePlaySession(next);
    setSession(next);
    router.push('/play/decide');
  };

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading chapter planning…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">{chapter.title}</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Choose your offer</h2>
        <p className="mt-3 text-muted">{chapter.briefingStakes}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => setSelectedOfferId(offer.id)}
            className={`rounded-xl border p-4 text-left shadow-sm transition ${
              selectedOffer?.id === offer.id
                ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                : 'border-border bg-card hover:border-accent/30'
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{offer.riskTag}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{offer.employer}</p>
            <p className="text-xs text-muted">{offer.title}</p>
            <p className="mt-2 text-lg font-semibold text-ink">
              {formatMoney(offer.baseSalaryAnnual)}/yr
            </p>
            <p className="mt-2 text-xs text-muted">
              {offer.remoteDaysPerWeek >= 5
                ? 'Remote'
                : `${offer.remoteDaysPerWeek} WFH days · ${offer.commuteMinutes} min commute`}
            </p>
            <p className="mt-2 text-sm text-muted">{offer.flavor}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedOffer}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          Continue to commands
        </button>
      </div>
    </div>
  );
}
