'use client';

import type { RibbonMetrics } from '../../lib/play-session';
import { formatMoney, formatMonths, formatPercent } from '../../lib/format-money';

interface MetricsRibbonProps {
  metrics: RibbonMetrics;
}

const METRIC_ITEMS: {
  key: keyof RibbonMetrics;
  label: string;
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
    label: 'Runway',
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

export function MetricsRibbon({ metrics }: MetricsRibbonProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {METRIC_ITEMS.map((item) => (
        <div
          key={item.key}
          className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{item.format(metrics)}</p>
        </div>
      ))}
    </div>
  );
}
