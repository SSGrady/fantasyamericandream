'use client';

import type { AuditSnapshot, TaxAdvantagedBucket } from '@fad/shared';
import type { MetricBreakdown } from '../../lib/play-session';
import { formatMoney, formatPercent } from '../../lib/format-money';
import { ProgressRings } from './ProgressRings';
import { ShowTheMath } from './ShowTheMath';

interface ImpactCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'neutral' | 'warning';
  mathSummary?: string;
  mathLines?: Array<{ label: string; amountCents: number }>;
}

function toneClass(tone: ImpactCard['tone']): string {
  if (tone === 'positive') return 'text-emerald-700';
  if (tone === 'warning') return 'text-amber-700';
  return 'text-ink';
}

function breakdownToWaterfall(
  lines: Array<{ label: string; amountCents: number }>,
): AuditSnapshot['waterfall'] {
  return lines.map((line) => ({
    label: line.label,
    amount: line.amountCents,
    category: 'other' as const,
  }));
}

function buildImpactCards(
  audit: AuditSnapshot,
  breakdown: MetricBreakdown,
  housingBurdenPct: number,
  emphasizeSavingsRate: boolean,
): ImpactCard[] {
  const savingsTone: ImpactCard['tone'] =
    audit.savingsRate >= 0.15 ? 'positive' : audit.savingsRate >= 0.05 ? 'neutral' : 'warning';
  const runwayTone: ImpactCard['tone'] =
    audit.emergencyRunwayMonths >= 6
      ? 'positive'
      : audit.emergencyRunwayMonths >= 3
        ? 'neutral'
        : 'warning';
  const housingTone: ImpactCard['tone'] =
    housingBurdenPct <= 0.3
      ? 'positive'
      : housingBurdenPct <= 0.35
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
    },
    {
      id: 'savings-rate',
      label: emphasizeSavingsRate ? 'Savings rate (unlocked emphasis)' : 'Savings rate',
      value: formatPercent(audit.savingsRate),
      detail: emphasizeSavingsRate
        ? 'Investing I unlocked: savings rate is your primary lever for the first $100K. Returns matter later.'
        : 'Intentional savings deposits as a share of net pay this period.',
      tone: savingsTone,
      mathSummary: breakdown.savingsRate.formula,
      mathLines: breakdown.savingsRate.lines,
    },
    {
      id: 'runway',
      label: 'Emergency runway',
      value:
        audit.emergencyRunwayMonths === Infinity
          ? '∞ mo'
          : `${audit.emergencyRunwayMonths.toFixed(1)} mo`,
      detail: 'Months of essential spend covered by checking cash.',
      tone: runwayTone,
      mathSummary: breakdown.emergencyRunway.formula,
      mathLines: [
        {
          label: 'Checking balance',
          amountCents: breakdown.emergencyRunway.checkingBalanceCents,
        },
        ...breakdown.emergencyRunway.burnComponents,
      ],
    },
    {
      id: 'housing-burden',
      label: 'Housing burden',
      value: formatPercent(housingBurdenPct),
      detail: 'Your rent share as a share of monthly net pay.',
      tone: housingTone,
      mathSummary: breakdown.housingBurden.formula,
      mathLines: breakdown.housingBurden.lines,
    },
  ];
}

interface ImpactAnalysisCardsProps {
  audit: AuditSnapshot;
  breakdown: MetricBreakdown;
  housingBurdenPct: number;
  rothIra?: TaxAdvantagedBucket;
  emphasizeSavingsRate?: boolean;
}

export function ImpactAnalysisCards({
  audit,
  breakdown,
  housingBurdenPct,
  rothIra,
  emphasizeSavingsRate = false,
}: ImpactAnalysisCardsProps) {
  const cards = buildImpactCards(audit, breakdown, housingBurdenPct, emphasizeSavingsRate);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {card.label}
            </p>
            <p className={`mt-1 text-xl font-semibold ${toneClass(card.tone)}`}>{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.detail}</p>
            <ShowTheMath
              lines={
                card.mathLines
                  ? breakdownToWaterfall(card.mathLines)
                  : audit.waterfall
              }
              summary={card.mathSummary}
            />
          </div>
        ))}
      </div>

      {Object.keys(audit.contributionProgress).length > 0 ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Contribution progress
          </p>
          <p className="mt-1 text-sm text-muted">
            Tax-year contributions from ledger transactions only. Account balance can include prior
            savings and market returns.
          </p>
          <div className="mt-4">
            <ProgressRings progress={audit.contributionProgress} rothIra={rothIra} />
          </div>
          <ShowTheMath
            lines={audit.waterfall.filter(
              (line) => line.label.includes('401') || line.label.includes('deferral'),
            )}
            summary="401(k) deferrals from payroll postings. Roth IRA progress counts tax-year contributions, not investment gains on an existing balance."
          />
        </div>
      ) : null}
    </div>
  );
}
