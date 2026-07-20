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
      className={`w-full rounded-xl p-4 text-left transition ${
        selected
          ? 'bg-accent/5 ring-2 ring-accent/40'
          : 'bg-card ring-1 ring-border/60 hover:ring-accent/30'
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
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Affordability gates · {knowledgeMode} mode
      </p>
      <ul className="space-y-2">
        {affordability.gates.map((gate) => (
          <li
            key={gate.id}
            className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
              gate.passed ? 'bg-emerald-50/80' : 'bg-amber-50/80'
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                gate.passed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}
              aria-hidden
            >
              {gate.passed ? '✓' : '!'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{gate.label}</p>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    gate.passed ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {gate.passed ? 'Pass' : 'Fail'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{gate.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
