'use client';

import type { ContributionProgress, TaxAdvantagedBucket } from '@fad/shared';
import { formatMoney, formatPercent } from '../../lib/format-money';

interface ProgressRingsProps {
  progress: Record<string, ContributionProgress>;
  rothIra?: TaxAdvantagedBucket;
}

const LABELS: Record<string, string> = {
  traditional401k: '401(k) deferrals',
  rothIra: 'Roth IRA contributions',
};

export function ProgressRings({ progress, rothIra }: ProgressRingsProps) {
  const entries = Object.entries(progress);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {entries.map(([key, item]) => {
        const pct = Math.min(100, Math.round(item.pctOfLimit * 100));
        const priorBalance =
          key === 'rothIra' && rothIra
            ? Math.max(0, rothIra.balance - rothIra.taxYearContributions)
            : 0;

        return (
          <div
            key={key}
            className="rounded-lg border border-border bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-accent) ${pct}%, var(--color-border) ${pct}%)`,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-xs font-semibold text-ink">
                  {pct}%
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{LABELS[key] ?? key}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatMoney(item.contributedCents)} of {formatMoney(item.limitCents)} (
                  {formatPercent(item.pctOfLimit, 0)} of limit)
                </p>
                <p className="text-xs text-muted">
                  {formatMoney(item.remainingCents)} remaining
                </p>
                {priorBalance > 0 ? (
                  <p className="mt-2 text-xs text-muted">
                    Account balance {formatMoney(rothIra?.balance ?? 0)} includes{' '}
                    {formatMoney(priorBalance)} from prior savings and market returns.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
