import { runForecast, computeGoalProbability, comparePoliciesWithCrn } from '@fad/monte-carlo';
import type { ForecastSnapshot } from '@fad/monte-carlo';
import { NextResponse } from 'next/server';

interface ForecastRequestBody {
  seed: string;
  snapshot: ForecastSnapshot;
  paths?: number;
  horizonMonths?: number;
  goalNetWorth?: number;
  policySnapshot?: ForecastSnapshot;
}

export async function POST(request: Request) {
  let body: ForecastRequestBody;
  try {
    body = (await request.json()) as ForecastRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.seed || typeof body.seed !== 'string' || body.seed.length > 128) {
    return NextResponse.json({ error: 'Invalid seed' }, { status: 400 });
  }
  if (!body.snapshot || typeof body.snapshot.netWorth !== 'number') {
    return NextResponse.json({ error: 'Invalid snapshot' }, { status: 400 });
  }

  const paths = Math.min(Math.max(body.paths ?? 500, 10), 1000);
  const horizonMonths = Math.min(Math.max(body.horizonMonths ?? 60, 6), 120);

  const forecast = runForecast(body.seed, body.snapshot, { paths, horizonMonths });
  const goal =
    body.goalNetWorth !== undefined
      ? computeGoalProbability(forecast, { goalNetWorth: body.goalNetWorth, horizonMonths })
      : null;

  const policyComparison = body.policySnapshot
    ? comparePoliciesWithCrn({
        seed: body.seed,
        baselineSnapshot: body.snapshot,
        policySnapshot: body.policySnapshot,
        paths,
        horizonMonths,
      })
    : null;

  return NextResponse.json({ forecast, goal, policyComparison });
}
