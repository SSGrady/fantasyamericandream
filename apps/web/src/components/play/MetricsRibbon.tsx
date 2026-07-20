'use client';

import type { RibbonMetrics } from '../../lib/play-session';
import { formatMoney, formatMonths, formatPercent } from '../../lib/format-money';

interface MetricsRibbonProps {
  metrics: RibbonMetrics;
  /** When set, only show these metric keys (briefing hero rail). */
  heroKeys?: (keyof RibbonMetrics)[];
  /** Show runway breakdown tooltip. */
  showRunwayTooltip?: boolean;
  runwayBreakdown?: {
    liquidCents: number;
    monthlyEssentialCents: number;
  };
}

const METRIC_ITEMS: {
  key: keyof RibbonMetrics;
  label: string;
  tooltip?: string;
  format: (metrics: RibbonMetrics) => string;
}[] = [
  {
    key: 'netWorth',
    label: 'Net worth',
    format: (m) =>
      `${formatMoney(m.netWorth)} from ${formatMoney(m.startNetWorth)} (${formatMoney(m.netWorthDelta, { signed: true })})`,
  },
  {
    key: 'takeHomePayMonthly',
    label: 'Net pay / mo',
    format: (m) => formatMoney(m.takeHomePayMonthly),
  },
  {
    key: 'deferral401kRate',
    label: '401(k) deferral',
    format: (m) => formatPercent(m.deferral401kRate),
  },
  {
    key: 'cashSurplusRate',
    label: 'Cash surplus',
    format: (m) => formatPercent(m.cashSurplusRate),
  },
  {
    key: 'savingsRate',
    label: 'Total savings',
    format: (m) => formatPercent(m.savingsRate),
  },
  {
    key: 'emergencyRunwayMonths',
    label: 'Liquid runway',
    tooltip:
      'Months of essential spending covered by liquid cash (checking + HYSA). Burn uses rent, utilities, groceries, insurance, and debt minimums.',
    format: (m) => formatMonths(m.emergencyRunwayMonths),
  },
  {
    key: 'housingBurdenPct',
    label: 'Housing burden',
    format: (m) => formatPercent(m.housingBurdenPct),
  },
  {
    key: 'dti',
    label: 'DTI',
    format: (m) => formatPercent(m.dti),
  },
];

export function MetricsRibbon({
  metrics,
  heroKeys,
  showRunwayTooltip,
  runwayBreakdown,
}: MetricsRibbonProps) {
  const items = heroKeys
    ? METRIC_ITEMS.filter((item) => heroKeys.includes(item.key))
    : METRIC_ITEMS;

  const gridClass = heroKeys
    ? 'grid grid-cols-2 gap-3 sm:grid-cols-4'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8';

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm"
          title={item.tooltip}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{item.format(metrics)}</p>
          {showRunwayTooltip && item.key === 'emergencyRunwayMonths' && runwayBreakdown ? (
            <p className="mt-1 text-xs text-muted">
              {formatMoney(runwayBreakdown.liquidCents)} liquid /{' '}
              {formatMoney(runwayBreakdown.monthlyEssentialCents)}/mo essential ={' '}
              {formatMonths(metrics.emergencyRunwayMonths)}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
