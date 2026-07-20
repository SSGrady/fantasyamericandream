'use client';

import type { AuditSnapshot } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';

export type ConsequenceCardVariant = 'metric' | 'headline' | 'stakeholder' | 'interrupt';

export interface ConsequenceCardProps {
  variant: ConsequenceCardVariant;
  title: string;
  body: string;
  audit?: AuditSnapshot;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export function ConsequenceCard({ variant, title, body, audit, sentiment = 'neutral' }: ConsequenceCardProps) {
  const borderClass =
    sentiment === 'positive'
      ? 'border-positive/30'
      : sentiment === 'negative'
        ? 'border-negative/30'
        : 'border-border';

  return (
    <article
      className={`phase-enter rounded-xl border bg-card p-4 shadow-sm ${borderClass}`}
      data-variant={variant}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{variant}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      {audit && variant === 'metric' ? (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-muted">Net worth</dt>
            <dd className="font-medium text-ink">{formatMoney(audit.netWorth)}</dd>
          </div>
          <div>
            <dt className="text-muted">Runway</dt>
            <dd className="font-medium text-ink">{audit.emergencyRunwayMonths.toFixed(1)} mo</dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}
