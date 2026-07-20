'use client';

import type { NetWorthWaterfallLine } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';

interface WaterfallListProps {
  lines: NetWorthWaterfallLine[];
}

const CATEGORY_LABELS: Record<NetWorthWaterfallLine['category'], string> = {
  income: 'Income',
  expense: 'Expenses',
  growth: 'Growth',
  debt: 'Debt service',
  other: 'Other',
};

export function WaterfallList({ lines }: WaterfallListProps) {
  if (lines.length === 0) {
    return (
      <p className="rounded-lg bg-surface px-3 py-2 text-sm text-muted">
        No waterfall entries for this period.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {lines.map((line) => (
        <div
          key={`${line.category}-${line.label}`}
          className="flex items-center justify-between rounded-lg bg-surface px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium text-ink">{line.label}</p>
            <p className="text-xs text-muted">{CATEGORY_LABELS[line.category]}</p>
          </div>
          <span
            className={`text-sm font-semibold ${line.amount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}
          >
            {formatMoney(line.amount, { signed: true })}
          </span>
        </div>
      ))}
    </div>
  );
}
