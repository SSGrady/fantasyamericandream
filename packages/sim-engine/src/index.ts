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
export { tickMonthWithSimulation, tickMonthsWithSimulation, tickSixMonthsWithSimulation } from './tick-month.js';
export type {
  TickMonthInput,
  TickMonthResult,
  TickMonthsInput,
  TickMonthsResult,
  TickSixMonthsResult,
} from './tick-month.js';
export {
  V0_STARTER_EVENT_DEFINITIONS,
  V0_STARTER_EVENT_IDS,
  V1_EXPANSION_EVENT_DEFINITIONS,
  V1_EXPANSION_EVENT_IDS,
} from './events/definitions/index.js';
export {
  ALL_EVENT_DEFINITIONS,
  assertEventRegistryComplete,
  getEventDefinition,
  listEventDefinitions,
} from './events/registry.js';
export { rollEventsForMonth, rollEventsForPeriod } from './events/roll-events.js';
export { tickSixMonths, exportAuditJson } from '@fad/ledger';
export type { SixMonthTickInput, SixMonthTickResult } from '@fad/ledger';
