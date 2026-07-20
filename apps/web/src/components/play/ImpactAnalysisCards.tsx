'use client';

import type { AuditSnapshot, TaxAdvantagedBucket } from '@fad/shared';
import type { MetricBreakdown } from '../../lib/play-session';
import { formatMoney, formatPercent } from '../../lib/format-money';
import { MetricBreakdownList, type MetricBreakdownListLine } from './MetricBreakdownList';
import { ProgressRings } from './ProgressRings';
import { ShowTheMath } from './ShowTheMath';
import { WaterfallList } from './WaterfallList';

interface ImpactCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'neutral' | 'warning';
  mathSummary?: string;
  mathLines?: MetricBreakdownListLine[];
  useWaterfall?: boolean;
}

function toneClass(tone: ImpactCard['tone']): string {
  if (tone === 'positive') return 'text-emerald-700';
  if (tone === 'warning') return 'text-amber-700';
  return 'text-ink';
}

function savingsMathLines(breakdown: MetricBreakdown): MetricBreakdownListLine[] {
  return breakdown.savingsRate.lines.map((line) => ({
    label: line.label,
    amountCents: line.amountCents,
    display: line.label.includes('denominator')
      ? 'neutral'
      : line.label.includes('numerator')
        ? 'balance'
        : 'balance',
  }));
}

function housingMathLines(breakdown: MetricBreakdown): MetricBreakdownListLine[] {
  return breakdown.housingBurden.lines.map((line) => ({
    label: line.label,
    amountCents: line.amountCents,
    display: line.label.includes('numerator') ? 'cost' : 'neutral',
  }));
}

function runwayMathLines(breakdown: MetricBreakdown): MetricBreakdownListLine[] {
  return [
    {
      label: 'Checking balance',
      amountCents: breakdown.emergencyRunway.checkingBalanceCents,
      display: 'balance',
    },
    ...breakdown.emergencyRunway.burnComponents.map((line) => ({
      label: line.label,
      amountCents: line.amountCents,
      display: 'cost' as const,
    })),
    {
      label: 'Monthly essential burn',
      amountCents: breakdown.emergencyRunway.monthlyBurnCents,
      display: 'cost',
    },
  ];
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
      detail: `Started at ${formatMoney(audit.startNetWorth)}; closing net worth ${formatMoney(audit.netWorth)} after this six-month window.`,
      tone: deltaTone,
      mathSummary:
        'Ledger waterfall by category: income increases net worth, expenses and debt service reduce it, growth reflects investment returns.',
      useWaterfall: true,
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
      mathLines: savingsMathLines(breakdown),
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
      mathLines: runwayMathLines(breakdown),
    },
    {
      id: 'housing-burden',
      label: 'Housing burden',
      value: formatPercent(housingBurdenPct),
      detail: 'Your rent share as a share of monthly net pay.',
      tone: housingTone,
      mathSummary: breakdown.housingBurden.formula,
      mathLines: housingMathLines(breakdown),
    },
  ];
}

interface ImpactAnalysisCardsProps {
  audit: AuditSnapshot;
  breakdown: MetricBreakdown;
  housingBurdenPct: number;
  rothIra?: TaxAdvantagedBucket;
  startingRothBalance?: number;
  emphasizeSavingsRate?: boolean;
}

export function ImpactAnalysisCards({
  audit,
  breakdown,
  housingBurdenPct,
  rothIra,
  startingRothBalance = 0,
  emphasizeSavingsRate = false,
}: ImpactAnalysisCardsProps) {
  const cards = buildImpactCards(audit, breakdown, housingBurdenPct, emphasizeSavingsRate);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.id} className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border/60">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{card.label}</p>
            <p className={`mt-1 text-xl font-semibold ${toneClass(card.tone)}`}>{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.detail}</p>
            <ShowTheMath summary={card.mathSummary}>
              {card.useWaterfall ? (
                <WaterfallList lines={audit.waterfall} />
              ) : card.mathLines ? (
                <MetricBreakdownList lines={card.mathLines} />
              ) : null}
            </ShowTheMath>
          </div>
        ))}
      </div>

      {Object.keys(audit.contributionProgress).length > 0 ? (
        <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border/60">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Contribution progress
          </p>
          <p className="mt-1 text-sm text-muted">
            Tax-year contributions from ledger transactions only. Limits use IRS 2026 calibration (
            $24,500 401(k), $7,500 IRA). Roth balance = starting + contributions + returns.
          </p>
          <div className="mt-4">
            <ProgressRings
              progress={audit.contributionProgress}
              rothIra={rothIra}
              startingRothBalance={startingRothBalance}
              rothMarketReturnsCents={audit.accountInvestmentReturns?.rothIra ?? 0}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
