import type { MacroRegime, MacroState } from '@fad/shared';

export interface RegimeDefinition {
  layoffClimateMultiplier: number;
  annualReturnMean: number;
  annualReturnStdDev: number;
  inflationAnnual: number;
  mortgageRate30y: number;
}

/** Expansion/recession multipliers and correlated macro variables (V0 stub). */
export const REGIME_DEFINITIONS: Record<MacroRegime, RegimeDefinition> = {
  expansion: {
    layoffClimateMultiplier: 0.8,
    annualReturnMean: 0.1,
    annualReturnStdDev: 0.15,
    inflationAnnual: 0.025,
    mortgageRate30y: 0.0655,
  },
  slow_growth: {
    layoffClimateMultiplier: 1.0,
    annualReturnMean: 0.06,
    annualReturnStdDev: 0.12,
    inflationAnnual: 0.03,
    mortgageRate30y: 0.067,
  },
  inflation_shock: {
    layoffClimateMultiplier: 1.2,
    annualReturnMean: 0.02,
    annualReturnStdDev: 0.18,
    inflationAnnual: 0.06,
    mortgageRate30y: 0.075,
  },
  mild_recession: {
    layoffClimateMultiplier: 2.0,
    annualReturnMean: -0.05,
    annualReturnStdDev: 0.2,
    inflationAnnual: 0.02,
    mortgageRate30y: 0.07,
  },
  severe_recession: {
    layoffClimateMultiplier: 2.5,
    annualReturnMean: -0.15,
    annualReturnStdDev: 0.25,
    inflationAnnual: 0.01,
    mortgageRate30y: 0.08,
  },
};

export function layoffClimateForRegime(regime: MacroRegime): number {
  return REGIME_DEFINITIONS[regime].layoffClimateMultiplier;
}

export function createMacroState(regime: MacroRegime, sp500ReturnYtd = 0): MacroState {
  const def = REGIME_DEFINITIONS[regime];
  return {
    regime,
    inflationAnnual: def.inflationAnnual,
    sp500ReturnYtd,
    mortgageRate30y: def.mortgageRate30y,
    layoffClimate: def.layoffClimateMultiplier,
  };
}

export function syncMacroToRegime(macro: MacroState, regime: MacroRegime): MacroState {
  const def = REGIME_DEFINITIONS[regime];
  return {
    ...macro,
    regime,
    inflationAnnual: def.inflationAnnual,
    mortgageRate30y: def.mortgageRate30y,
    layoffClimate: def.layoffClimateMultiplier,
  };
}

/** Low-probability regime transitions for stub simulation. */
export function maybeTransitionRegime(current: MacroRegime, rng: () => number): MacroRegime {
  const roll = rng();

  if (current === 'expansion') {
    if (roll < 0.02) {
      return 'slow_growth';
    }
    if (roll < 0.025) {
      return 'mild_recession';
    }
    return current;
  }

  if (current === 'slow_growth' && roll < 0.03) {
    return 'expansion';
  }

  if (current === 'mild_recession') {
    if (roll < 0.05) {
      return 'severe_recession';
    }
    if (roll < 0.08) {
      return 'expansion';
    }
    return current;
  }

  if (current === 'severe_recession' && roll < 0.06) {
    return 'mild_recession';
  }

  if (current === 'inflation_shock' && roll < 0.04) {
    return 'slow_growth';
  }

  return current;
}
