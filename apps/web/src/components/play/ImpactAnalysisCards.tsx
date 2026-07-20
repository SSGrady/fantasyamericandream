'use client';

import type { AuditSnapshot } from '@fad/shared';
import type { RibbonMetrics } from '../../lib/play-session';
import { formatMoney, formatMonths, formatPercent } from '../../lib/format-money';
import { ProgressRings } from './ProgressRings';
import { ShowTheMath } from './ShowTheMath';

interface ImpactCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'neutral' | 'warning';
  mathSummary?: string;
  waterfallFilter?: (line: AuditSnapshot['waterfall'][number]) => boolean;
}

function toneClass(tone: ImpactCard['tone']): string {
  if (tone === 'positive') return 'text-emerald-700';
  if (tone === 'warning') return 'text-amber-700';
  return 'text-ink';
}

function buildImpactCards(audit: AuditSnapshot, metrics: RibbonMetrics): ImpactCard[] {
  const savingsTone: ImpactCard['tone'] =
    audit.savingsRate >= 0.15 ? 'positive' : audit.savingsRate >= 0.05 ? 'neutral' : 'warning';
  const runwayTone: ImpactCard['tone'] =
    audit.emergencyRunwayMonths >= 6
      ? 'positive'
      : audit.emergencyRunwayMonths >= 3
        ? 'neutral'
        : 'warning';
  const housingTone: ImpactCard['tone'] =
    metrics.housingBurdenPct <= 0.3
      ? 'positive'
      : metrics.housingBurdenPct <= 0.35
        ? 'neutral'
        : 'warning';
  const deltaTone: ImpactCard['tone'] = audit.netWorthDelta >= 0 ? 'positive' : 'warning';

  return [
    {
      id: 'net-worth-delta',
      label: 'Net worth delta',
      value: formatMoney(audit.netWorthDelta, { signed: true }),
      detail: `Closing net worth ${formatMoney(audit.netWorth)} after this six-month window.`,
      tone: deltaTone,
      mathSummary: 'Ledger waterfall from income through expenses, growth, and debt.',
      waterfallFilter: () => true,
    },
    {
      id: 'savings-rate',
      label: 'Savings rate',
      value: formatPercent(audit.savingsRate),
      detail: 'Share of take-home retained or invested this period.',
      tone: savingsTone,
      mathSummary: 'Income minus spending and debt service, divided by gross inflow.',
      waterfallFilter: (line) => line.category === 'income' || line.category === 'expense',
    },
    {
      id: 'runway',
      label: 'Emergency runway',
      value: formatMonths(audit.emergencyRunwayMonths),
      detail: 'Months of essential spend covered by liquid cash.',
      tone: runwayTone,
      mathSummary: 'Checking plus HYSA divided by monthly burn from the audit.',
      waterfallFilter: (line) => line.label === 'Rent' || line.category === 'expense',
    },
    {
      id: 'housing-burden',
      label: 'Housing burden',
      value: formatPercent(metrics.housingBurdenPct),
      detail: 'Rent as a share of period take-home pay.',
      tone: housingTone,
      mathSummary: 'Rent line from the waterfall over total income for the period.',
      waterfallFilter: (line) => line.label === 'Rent' || line.category === 'income',
    },
  ];
}

interface ImpactAnalysisCardsProps {
  audit: AuditSnapshot;
  metrics: RibbonMetrics;
}

export function ImpactAnalysisCards({ audit, metrics }: ImpactAnalysisCardsProps) {
  const cards = buildImpactCards(audit, metrics);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const filteredLines = card.waterfallFilter
            ? audit.waterfall.filter(card.waterfallFilter)
            : audit.waterfall;

          return (
            <div
              key={card.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {card.label}
              </p>
              <p className={`mt-1 text-xl font-semibold ${toneClass(card.tone)}`}>{card.value}</p>
              <p className="mt-2 text-sm text-muted">{card.detail}</p>
              <ShowTheMath lines={filteredLines} summary={card.mathSummary} />
            </div>
          );
        })}
      </div>

      {Object.keys(audit.contributionProgress).length > 0 ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Contribution progress
          </p>
          <p className="mt-1 text-sm text-muted">
            Tax-advantaged room used this calendar year.
          </p>
          <div className="mt-4">
            <ProgressRings progress={audit.contributionProgress} />
          </div>
          <ShowTheMath
            lines={audit.waterfall.filter((line) => line.label.includes('401') || line.label.includes('Roth'))}
            summary="Deferral and IRA postings from payroll and transfers."
          />
        </div>
      ) : null}
    </div>
  );
}
