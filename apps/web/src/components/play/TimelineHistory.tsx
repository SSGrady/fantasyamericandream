'use client';

import type { PeriodHistoryEntry } from '../../lib/play-session';
import { formatMoney, formatPercent } from '../../lib/format-money';

interface TimelineHistoryProps {
  entries: PeriodHistoryEntry[];
  startingNetWorth?: number;
  startDate?: string;
}

export function TimelineHistory({ entries, startingNetWorth, startDate }: TimelineHistoryProps) {
  if (entries.length === 0 && startingNetWorth === undefined) {
    return (
      <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted shadow-sm">
        No completed periods yet. Finish an audit to build your timeline.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-border pl-4">
      {startingNetWorth !== undefined ? (
        <li className="relative">
          <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-muted" />
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">Starting balance</p>
              {startDate ? <p className="text-xs text-muted">As of {startDate}</p> : null}
            </div>
            <p className="mt-2 text-sm text-muted">
              Net worth{' '}
              <span className="font-medium text-ink">{formatMoney(startingNetWorth)}</span>
            </p>
          </div>
        </li>
      ) : null}
      {entries.map((entry) => (
        <li key={`${entry.periodIndex}-${entry.asOf}`} className="relative">
          <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">Period {entry.periodIndex}</p>
              <p className="text-xs text-muted">As of {entry.asOf}</p>
            </div>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
              <p className="text-muted">
                Started{' '}
                <span className="font-medium text-ink">{formatMoney(entry.startNetWorth)}</span>
              </p>
              <p className="text-muted">
                Ending{' '}
                <span className="font-medium text-ink">{formatMoney(entry.netWorth)}</span>
              </p>
              <p className="text-muted">
                Change{' '}
                <span className="font-medium text-ink">
                  {formatMoney(entry.netWorthDelta, { signed: true })}
                </span>
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">
              Savings rate{' '}
              <span className="font-medium text-ink">{formatPercent(entry.savingsRate)}</span>
            </p>
            {entry.playerAction ? (
              <p className="mt-2 text-xs text-muted">Action: {entry.playerAction}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
