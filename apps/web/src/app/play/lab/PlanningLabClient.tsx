'use client';

import { useEffect, useState } from 'react';
import { FanChart } from '../../../components/lab/FanChart';
import { formatMoney, formatPercent } from '../../../lib/format-money';
import { usePlaySession } from '../../../lib/use-play-session';

export function PlanningLabClient() {
  const { session, ready } = usePlaySession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<{
    percentiles: { monthIndex: number; p10: number; p50: number; p90: number }[];
    goal: { probability: number } | null;
    policyComparison: { deltaMedianFinal: number; decisionCents: number; luckCents: number } | null;
  } | null>(null);

  useEffect(() => {
    if (!ready || !session?.currentAudit) return;

    let cancelled = false;
    async function loadForecast() {
      setLoading(true);
      setError(null);
      const audit = session!.currentAudit!;
      const monthlyBurn = Math.max(audit.waterfall.filter((l) => l.category === 'expense').reduce((s, l) => s + Math.abs(l.amount), 0) / 6, 1);
      const monthlySavings = Math.round(audit.savingsRate * (audit.periodNetPayCents / 6));

      try {
        const response = await fetch('/api/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seed: session!.gameState.run.randomSeed,
            snapshot: {
              netWorth: audit.netWorth,
              monthlySavingsCents: monthlySavings,
              monthlyBurnCents: monthlyBurn,
            },
            paths: 500,
            horizonMonths: 60,
            goalNetWorth: 100_000_00,
            policySnapshot: {
              netWorth: audit.netWorth,
              monthlySavingsCents: monthlySavings + 200_00,
              monthlyBurnCents: monthlyBurn,
            },
          }),
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        if (!cancelled) {
          setForecastData({
            percentiles: data.forecast.percentiles,
            goal: data.goal,
            policyComparison: data.policyComparison,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Forecast failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadForecast();
    return () => {
      cancelled = true;
    };
  }, [ready, session]);

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading planning lab…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Monte Carlo lab</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Five-year net worth fan</h2>
        <p className="mt-3 text-muted">
          Read-only forecast from your current audit snapshot. Ledger state is never mutated here.
        </p>
      </div>

      {loading ? (
        <p className="text-muted">Running 500 paths…</p>
      ) : error ? (
        <p className="text-negative">{error}</p>
      ) : forecastData ? (
        <>
          <FanChart percentiles={forecastData.percentiles} />
          {forecastData.goal ? (
            <p className="text-sm text-muted">
              P($100k by year 5): {formatPercent(forecastData.goal.probability, { digits: 0 })}
            </p>
          ) : null}
          {forecastData.policyComparison ? (
            <div className="rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
              <p className="font-medium text-ink">+$200/mo savings policy (CRN)</p>
              <p className="mt-1 text-muted">
                Median delta {formatMoney(forecastData.policyComparison.deltaMedianFinal, { signed: true })}{' '}
                · decision {formatMoney(forecastData.policyComparison.decisionCents, { signed: true })} · luck{' '}
                {formatMoney(forecastData.policyComparison.luckCents, { signed: true })}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
