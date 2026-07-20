'use client';

import type { ListingAffordability } from '../../lib/dream-home';
import { formatMoney } from '../../lib/format-money';

interface ListingCardProps {
  affordability: ListingAffordability;
  selected: boolean;
  onSelect: () => void;
}

export function ListingCard({ affordability, selected, onSelect }: ListingCardProps) {
  const { listing, cashToCloseCents, pitiMonthlyCents, passCount, blockedInGuardrails } =
    affordability;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left shadow-sm transition ${
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border bg-card hover:border-accent/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{listing.address}</p>
          <p className="text-xs text-muted">
            {listing.city}, {listing.stateCode} · {listing.beds} bd · {listing.baths} ba ·{' '}
            {listing.sqft.toLocaleString()} sqft
          </p>
        </div>
        <p className="text-sm font-semibold text-ink">{formatMoney(listing.priceCents)}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
        <span>PITI est. {formatMoney(pitiMonthlyCents)}/mo</span>
        <span>Cash to close {formatMoney(cashToCloseCents)}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-ink">
        {passCount}/5 gates pass
        {blockedInGuardrails ? ' · Blocked in guardrails mode' : ''}
      </p>
    </button>
  );
}

interface AffordabilityGatesProps {
  affordability: ListingAffordability;
  knowledgeMode: 'guardrails' | 'acknowledge' | 'sandbox';
}

export function AffordabilityGates({ affordability, knowledgeMode }: AffordabilityGatesProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Affordability gates · {knowledgeMode} mode
      </p>
      {affordability.gates.map((gate) => (
        <div
          key={gate.id}
          className={`rounded-md border px-3 py-2 ${
            gate.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">{gate.label}</p>
            <span
              className={`text-xs font-semibold ${
                gate.passed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {gate.passed ? 'Pass' : 'Fail'}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">{gate.detail}</p>
        </div>
      ))}
    </div>
  );
}
