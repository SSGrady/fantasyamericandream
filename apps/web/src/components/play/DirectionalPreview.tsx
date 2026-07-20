'use client';

import { formatMoney } from '../../lib/format-money';

export type DirectionalBand = 'likely_up' | 'flat' | 'likely_down' | 'unknown';

export function bandFromDelta(deltaCents: number | null, isFlat?: boolean): DirectionalBand {
  if (deltaCents === null) return 'unknown';
  if (isFlat || Math.abs(deltaCents) < 500_00) return 'flat';
  return deltaCents > 0 ? 'likely_up' : 'likely_down';
}

const BAND_LABELS: Record<DirectionalBand, string> = {
  likely_up: 'Likely up',
  flat: 'Roughly flat',
  likely_down: 'Likely down',
  unknown: 'Forecast pending',
};

const BAND_COLORS: Record<DirectionalBand, string> = {
  likely_up: 'text-positive',
  flat: 'text-muted',
  likely_down: 'text-negative',
  unknown: 'text-muted',
};

interface DirectionalPreviewProps {
  deltaNetWorth: number | null;
  deltaRunwayMonths?: number | null;
  isFlat?: boolean;
  flatReason?: string | null;
  loading?: boolean;
}

export function DirectionalPreview({
  deltaNetWorth,
  deltaRunwayMonths,
  isFlat,
  flatReason,
  loading,
}: DirectionalPreviewProps) {
  if (loading) {
    return (
      <p className="text-sm text-muted" aria-live="polite">
        Updating forecast…
      </p>
    );
  }

  if (flatReason) {
    return (
      <div className="space-y-1">
        <p className={`text-sm font-medium ${BAND_COLORS.flat}`}>{BAND_LABELS.flat}</p>
        <p className="text-xs text-muted">{flatReason}</p>
      </div>
    );
  }

  const band = bandFromDelta(deltaNetWorth, isFlat);
  const rangeLabel =
    band === 'likely_up'
      ? deltaNetWorth !== null
        ? `+${formatMoney(Math.max(500_00, Math.abs(deltaNetWorth) * 0.6))} to +${formatMoney(Math.abs(deltaNetWorth) * 1.4)}`
        : 'Upside band'
      : band === 'likely_down'
        ? deltaNetWorth !== null
          ? `${formatMoney(Math.min(-500_00, deltaNetWorth * 1.4))} to ${formatMoney(deltaNetWorth * 0.6)}`
          : 'Downside band'
        : 'Within noise band';

  return (
    <div className="space-y-1" aria-live="polite">
      <p className={`text-sm font-medium ${BAND_COLORS[band]}`}>{BAND_LABELS[band]}</p>
      <p className="text-xs text-muted">
        Forecast (not ledger fact): {rangeLabel}
        {deltaRunwayMonths !== null && deltaRunwayMonths !== undefined
          ? ` · Runway ${deltaRunwayMonths >= 0 ? '+' : ''}${deltaRunwayMonths.toFixed(1)} mo`
          : ''}
      </p>
    </div>
  );
}
