export { createRng, randomNormal } from './rng.js';
export {
  REGIME_DEFINITIONS,
  createMacroState,
  layoffClimateForRegime,
  maybeTransitionRegime,
  syncMacroToRegime,
} from './macro-regimes.js';
export type { RegimeDefinition } from './macro-regimes.js';
export { BASELINE_MONTHLY_LAYOFF_RATE, monthlyLayoffHazard, rollLayoff } from './layoff.js';
export type { LayoffRollResult } from './layoff.js';
export { buildInvestmentReturnTransactions, sampleMonthlyReturn } from './market-returns.js';
export { tickMonthWithSimulation, tickMonthsWithSimulation } from './tick-month.js';
export type {
  TickMonthInput,
  TickMonthResult,
  TickMonthsInput,
  TickMonthsResult,
} from './tick-month.js';
export { tickSixMonths, exportAuditJson } from '@fad/ledger';
export type { SixMonthTickInput, SixMonthTickResult } from '@fad/ledger';
