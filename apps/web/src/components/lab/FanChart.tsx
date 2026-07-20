'use client';

import type { ForecastPercentiles } from '@fad/monte-carlo';
import { formatMoney } from '../../lib/format-money';

interface FanChartProps {
  percentiles: ForecastPercentiles[];
  width?: number;
  height?: number;
}

/** Percentile fan chart (visx-style bands via SVG). */
export function FanChart({ percentiles, width = 640, height = 280 }: FanChartProps) {
  if (percentiles.length === 0) {
    return <p className="text-sm text-muted">No forecast data yet.</p>;
  }

  const padding = { top: 16, right: 16, bottom: 32, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxMonth = percentiles.at(-1)?.monthIndex ?? 1;
  const values = percentiles.flatMap((p) => [p.p10, p.p50, p.p90]);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const yRange = Math.max(maxY - minY, 1);

  const x = (month: number) => padding.left + (month / maxMonth) * innerW;
  const y = (cents: number) =>
    padding.top + innerH - ((cents - minY) / yRange) * innerH;

  const bandPath = [
    ...percentiles.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.monthIndex)} ${y(p.p90)}`),
    ...[...percentiles].reverse().map((p) => `L ${x(p.monthIndex)} ${y(p.p10)}`),
    'Z',
  ].join(' ');

  const medianPath = percentiles
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.monthIndex)} ${y(p.p50)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl" role="img" aria-label="Net worth forecast fan chart">
      <path d={bandPath} fill="var(--color-accent)" fillOpacity={0.15} />
      <path d={medianPath} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
      <text x={padding.left} y={height - 8} className="fill-muted text-[10px]">
        0 mo
      </text>
      <text x={width - padding.right - 24} y={height - 8} className="fill-muted text-[10px]">
        {maxMonth} mo
      </text>
      <text x={8} y={padding.top + 4} className="fill-muted text-[10px]">
        {formatMoney(maxY)}
      </text>
      <text x={8} y={padding.top + innerH} className="fill-muted text-[10px]">
        {formatMoney(minY)}
      </text>
    </svg>
  );
}
