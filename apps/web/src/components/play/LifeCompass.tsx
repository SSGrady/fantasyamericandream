'use client';

import type { AuditSnapshot } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';

export interface LifeCompassDimension {
  id: string;
  label: string;
  score: number;
  hint: string;
}

export function buildLifeCompassDimensions(
  audit: AuditSnapshot,
  housingBurdenPct: number,
): LifeCompassDimension[] {
  const savingsScore = Math.min(100, Math.round(audit.savingsRate * 500));
  const runwayScore = Math.min(100, Math.round(audit.emergencyRunwayMonths * 20));
  const housingScore = Math.max(0, 100 - Math.round(housingBurdenPct * 200));
  const wealthScore = Math.min(100, Math.round(audit.netWorth / 1000));
  const stabilityScore = Math.round((runwayScore + housingScore) / 2);

  return [
    { id: 'wealth', label: 'Wealth', score: wealthScore, hint: formatMoney(audit.netWorth) },
    { id: 'savings', label: 'Savings', score: savingsScore, hint: `${Math.round(audit.savingsRate * 100)}% rate` },
    { id: 'runway', label: 'Runway', score: runwayScore, hint: `${audit.emergencyRunwayMonths.toFixed(1)} mo` },
    { id: 'housing', label: 'Housing', score: housingScore, hint: `${Math.round(housingBurdenPct * 100)}% burden` },
    { id: 'stability', label: 'Stability', score: stabilityScore, hint: 'Runway + housing composite' },
  ];
}

interface LifeCompassProps {
  dimensions: LifeCompassDimension[];
}

export function LifeCompass({ dimensions }: LifeCompassProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {dimensions.map((dim) => (
        <div key={dim.id} className="rounded-xl border border-border bg-card p-4 shadow-sm phase-enter">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{dim.label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{dim.score}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-accent" style={{ width: `${dim.score}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{dim.hint}</p>
        </div>
      ))}
    </div>
  );
}
