'use client';

import { formatMoney } from '../../lib/format-money';

export interface MetricBreakdownListLine {
  label: string;
  amountCents: number;
  /** How to display the amount in impact analysis math panels. */
  display?: 'neutral' | 'cost' | 'balance';
}

interface MetricBreakdownListProps {
  lines: MetricBreakdownListLine[];
}

function amountClass(display: MetricBreakdownListLine['display']): string {
  if (display === 'cost') return 'text-red-700';
  if (display === 'balance') return 'text-ink';
  return 'text-muted';
}

function formatLineAmount(cents: number, display: MetricBreakdownListLine['display']): string {
  if (display === 'cost') {
    return formatMoney(Math.abs(cents));
  }
  return formatMoney(cents);
}

export function MetricBreakdownList({ lines }: MetricBreakdownListProps) {
  if (lines.length === 0) {
    return (
      <p className="rounded-lg bg-surface px-3 py-2 text-sm text-muted">
        No breakdown lines for this metric.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {lines.map((line) => (
        <div
          key={line.label}
          className="flex items-center justify-between rounded-lg bg-surface px-3 py-2"
        >
          <p className="text-sm text-ink">{line.label}</p>
          <span className={`text-sm font-medium ${amountClass(line.display ?? 'neutral')}`}>
            {formatLineAmount(line.amountCents, line.display ?? 'neutral')}
          </span>
        </div>
      ))}
    </div>
  );
}
