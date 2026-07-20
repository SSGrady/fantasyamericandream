'use client';

import type { JobOffer } from '@fad/domain';
import { formatMoney } from '../../lib/format-money';

export interface JobOfferPickerProps {
  offers: JobOffer[];
  selectedOfferId: string | null;
  onSelect: (offerId: string) => void;
  showCustom?: boolean;
  customSelected?: boolean;
}

export function JobOfferPicker({
  offers,
  selectedOfferId,
  onSelect,
  showCustom = true,
  customSelected = false,
}: JobOfferPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <button
          key={offer.id}
          type="button"
          onClick={() => onSelect(offer.id)}
          className={`rounded-xl border p-4 text-left shadow-sm transition ${
            selectedOfferId === offer.id && !customSelected
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
      {showCustom ? (
        <button
          type="button"
          onClick={() => onSelect('custom')}
          className={`rounded-xl border p-4 text-left shadow-sm transition ${
            customSelected
              ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
              : 'border-border bg-card hover:border-accent/30'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">custom</p>
          <p className="mt-1 text-sm font-semibold text-ink">Negotiate your own</p>
          <p className="text-xs text-muted">Set employer, title, and salary</p>
          <p className="mt-2 text-sm text-muted">
            Use when none of the presets fit your target comp or remote policy.
          </p>
        </button>
      ) : null}
    </div>
  );
}
