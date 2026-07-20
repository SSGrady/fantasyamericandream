import type { MoneyCents } from '@fad/shared';

export function formatMoney(cents: MoneyCents, options?: { signed?: boolean }): string {
  const dollars = cents / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.abs(dollars));

  if (options?.signed && cents !== 0) {
    return cents > 0 ? `+${formatted}` : `−${formatted}`;
  }
  return cents < 0 ? `−${formatted}` : formatted;
}

export function formatPercent(
  value: number,
  options?: number | { digits?: number; signed?: boolean },
): string {
  const opts = typeof options === 'number' ? { digits: options } : (options ?? {});
  const digits = opts.digits ?? 0;
  const pct = (value * 100).toFixed(digits);
  if (opts.signed && value !== 0) {
    return value > 0 ? `+${pct}%` : `−${Math.abs(value * 100).toFixed(digits)}%`;
  }
  return `${pct}%`;
}

export function formatMonths(value: number): string {
  if (!Number.isFinite(value)) return '∞';
  return value >= 10 ? `${Math.round(value)} mo` : `${value.toFixed(1)} mo`;
}
