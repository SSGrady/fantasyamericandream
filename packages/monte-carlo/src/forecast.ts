import type { MoneyCents } from '@fad/shared';
import { createRng, randomNormal } from '@fad/sim-engine';

export interface ForecastSnapshot {
  netWorth: MoneyCents;
  monthlySavingsCents: MoneyCents;
  monthlyBurnCents: MoneyCents;
}

export interface ForecastPath {
  netWorthByMonth: MoneyCents[];
}

export interface ForecastPercentiles {
  monthIndex: number;
  p10: MoneyCents;
  p50: MoneyCents;
  p90: MoneyCents;
}

export interface ForecastResult {
  paths: ForecastPath[];
  percentiles: ForecastPercentiles[];
  horizonMonths: number;
  pathCount: number;
}

export interface GoalProbabilityInput {
  goalNetWorth: MoneyCents;
  horizonMonths: number;
}

export interface GoalProbabilityResult {
  probability: number;
  pathsHitGoal: number;
  pathCount: number;
}

export interface PolicyComparisonInput {
  baselineSnapshot: ForecastSnapshot;
  policySnapshot: ForecastSnapshot;
  seed: string;
  paths?: number;
  horizonMonths?: number;
}

export interface PolicyComparisonResult {
  baselineMedianFinal: MoneyCents;
  policyMedianFinal: MoneyCents;
  deltaMedianFinal: MoneyCents;
  /** Attribution split on median delta (decision vs luck). */
  decisionCents: MoneyCents;
  luckCents: MoneyCents;
}

const DEFAULT_PATHS = 500;
const DEFAULT_HORIZON = 60;
const ANNUAL_RETURN_MEAN = 0.07;
const ANNUAL_RETURN_VOL = 0.15;

/** Read-only stochastic forecast. Never mutates ledger state. */
export function runForecast(
  seed: string,
  snapshot: ForecastSnapshot,
  options?: { paths?: number; horizonMonths?: number },
): ForecastResult {
  const pathCount = options?.paths ?? DEFAULT_PATHS;
  const horizonMonths = options?.horizonMonths ?? DEFAULT_HORIZON;
  const monthlyReturnMean = ANNUAL_RETURN_MEAN / 12;
  const monthlyReturnVol = ANNUAL_RETURN_VOL / Math.sqrt(12);

  const paths: ForecastPath[] = [];
  const percentileBuckets: MoneyCents[][] = Array.from({ length: horizonMonths + 1 }, () => []);

  for (let pathIndex = 0; pathIndex < pathCount; pathIndex++) {
    const rng = createRng(`${seed}:path:${pathIndex}`);
    let netWorth = snapshot.netWorth;
    const netWorthByMonth: MoneyCents[] = [netWorth];

    for (let month = 1; month <= horizonMonths; month++) {
      const marketReturn = monthlyReturnMean + monthlyReturnVol * randomNormal(rng);
      netWorth = Math.round(
        netWorth * (1 + marketReturn) + snapshot.monthlySavingsCents - snapshot.monthlyBurnCents,
      );
      netWorthByMonth.push(netWorth);
      percentileBuckets[month]?.push(netWorth);
    }
    paths.push({ netWorthByMonth });
  }

  const percentiles: ForecastPercentiles[] = percentileBuckets.map((bucket, monthIndex) => ({
    monthIndex,
    ...percentileAt(bucket, [0.1, 0.5, 0.9]),
  }));

  return { paths, percentiles, horizonMonths, pathCount };
}

export function computeGoalProbability(
  forecast: ForecastResult,
  goal: GoalProbabilityInput,
): GoalProbabilityResult {
  let pathsHitGoal = 0;
  for (const path of forecast.paths) {
    const final = path.netWorthByMonth[goal.horizonMonths] ?? path.netWorthByMonth.at(-1) ?? 0;
    if (final >= goal.goalNetWorth) pathsHitGoal += 1;
  }
  return {
    probability: forecast.pathCount > 0 ? pathsHitGoal / forecast.pathCount : 0,
    pathsHitGoal,
    pathCount: forecast.pathCount,
  };
}

/** Common-random-number policy comparison for lab attribution. */
export function comparePoliciesWithCrn(input: PolicyComparisonInput): PolicyComparisonResult {
  const paths = input.paths ?? DEFAULT_PATHS;
  const horizonMonths = input.horizonMonths ?? DEFAULT_HORIZON;
  const baseline = runForecast(`${input.seed}:baseline`, input.baselineSnapshot, {
    paths,
    horizonMonths,
  });
  const policy = runForecast(`${input.seed}:policy`, input.policySnapshot, {
    paths,
    horizonMonths,
  });

  const baselineFinals = baseline.paths.map((p) => p.netWorthByMonth.at(-1) ?? 0);
  const policyFinals = policy.paths.map((p) => p.netWorthByMonth.at(-1) ?? 0);
  const baselineMedian = median(baselineFinals);
  const policyMedian = median(policyFinals);
  const delta = policyMedian - baselineMedian;

  const savingsDelta =
    (input.policySnapshot.monthlySavingsCents - input.baselineSnapshot.monthlySavingsCents) *
    horizonMonths;
  const decisionCents = Math.round(Math.min(Math.abs(delta), Math.abs(savingsDelta)) * Math.sign(delta));
  const luckCents = delta - decisionCents;

  return {
    baselineMedianFinal: baselineMedian,
    policyMedianFinal: policyMedian,
    deltaMedianFinal: delta,
    decisionCents,
    luckCents,
  };
}

function percentileAt(values: MoneyCents[], quantiles: number[]): { p10: MoneyCents; p50: MoneyCents; p90: MoneyCents } {
  if (values.length === 0) return { p10: 0, p50: 0, p90: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const pick = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * (sorted.length - 1)))] ?? 0;
  return { p10: pick(quantiles[0] ?? 0.1), p50: pick(quantiles[1] ?? 0.5), p90: pick(quantiles[2] ?? 0.9) };
}

function median(values: MoneyCents[]): MoneyCents {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2)
    : (sorted[mid] ?? 0);
}
