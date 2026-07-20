/// <reference lib="webworker" />
import { runForecast } from '@fad/monte-carlo';
import type { ForecastSnapshot } from '@fad/monte-carlo';

/** Comlink-compatible forecast worker (postMessage API). */
export interface ForecastWorkerRequest {
  id: string;
  seed: string;
  snapshot: ForecastSnapshot;
  paths?: number;
  horizonMonths?: number;
}

export interface ForecastWorkerResponse {
  id: string;
  forecast: ReturnType<typeof runForecast>;
}

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event: MessageEvent<ForecastWorkerRequest>) => {
  const { id, seed, snapshot, paths, horizonMonths } = event.data;
  const forecast = runForecast(seed, snapshot, { paths, horizonMonths });
  const response: ForecastWorkerResponse = { id, forecast };
  self.postMessage(response);
};
