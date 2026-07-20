'use client';

import type { LifeRailData } from '@fad/domain';
import { formatMoney } from '../../lib/format-money';

interface LifeRailProps {
  data: LifeRailData;
}

export function LifeRail({ data }: LifeRailProps) {
  const capacityPct =
    data.weeklyCapacityHours > 0
      ? Math.min(100, (data.weeklyCapacityUsed / data.weeklyCapacityHours) * 100)
      : 0;

  return (
    <aside className="sticky top-4 space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:top-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Life rail</p>
        <p className="mt-1 font-display text-lg text-ink">{data.jobTitle}</p>
        <p className="text-sm text-muted">Net worth {formatMoney(data.netWorth)}</p>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Liquid runway</dt>
          <dd className="font-medium text-ink">{data.liquidRunwayMonths.toFixed(1)} mo</dd>
        </div>
        <div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Weekly capacity</dt>
            <dd className="font-medium text-ink">
              {data.weeklyCapacityUsed}h / {data.weeklyCapacityHours}h
            </dd>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>
      </dl>

      {data.openThreads.length > 0 ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Open threads</p>
          <ul className="mt-2 space-y-1.5">
            {data.openThreads.map((thread) => (
              <li
                key={thread.id}
                className="rounded-md bg-surface px-2 py-1.5 text-xs text-ink"
              >
                {thread.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
