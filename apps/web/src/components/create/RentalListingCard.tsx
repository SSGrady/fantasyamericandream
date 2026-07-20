'use client';

import type { RentalListing } from '../../lib/rental-picker';
import { formatMoney } from '../../lib/format-money';

interface RentalListingCardProps {
  listing: RentalListing;
  playerShareMonthly: number;
  selected: boolean;
  onSelect: () => void;
}

export function RentalListingCard({
  listing,
  playerShareMonthly,
  selected,
  onSelect,
}: RentalListingCardProps) {
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
            {listing.neighborhood} · {listing.city}, {listing.stateCode}
          </p>
          <p className="mt-1 text-xs text-muted">
            {listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString()} sqft
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">
            {formatMoney(listing.marketRentMonthly)}/mo
          </p>
          <p className="text-xs text-accent">Your share {formatMoney(playerShareMonthly)}/mo</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{listing.flavor}</p>
    </button>
  );
}
