import type { MoneyCents } from './game-state.js';

/** Default term life coverage stub ($500k). */
export const DEFAULT_TERM_LIFE_COVERAGE_CENTS = 500_000_00;

export interface InsuranceState {
  /** Term life policy active (module toggle). */
  termLifeEnabled: boolean;
  /** Short-term disability policy active when employed (module toggle). */
  disabilityEnabled: boolean;
  termLifeCoverageCents: MoneyCents;
}

export const DEFAULT_INSURANCE_STATE: InsuranceState = {
  termLifeEnabled: false,
  disabilityEnabled: false,
  termLifeCoverageCents: DEFAULT_TERM_LIFE_COVERAGE_CENTS,
};

/** Monthly term life premium by age band and coverage (stub bands, not carrier quotes). */
export function termLifePremiumMonthlyCents(
  ageYears: number,
  coverageCents: MoneyCents = DEFAULT_TERM_LIFE_COVERAGE_CENTS,
): MoneyCents {
  const ratePer100k =
    ageYears < 30 ? 0.5 : ageYears < 40 ? 0.85 : ageYears < 50 ? 1.4 : 2.2;
  const hundredsOf100k = coverageCents / 100_00_00;
  return Math.max(0, Math.round(hundredsOf100k * ratePer100k * 100));
}

/** Disability income replacement premium stub (~1.5% of gross monthly when employed). */
export function disabilityPremiumMonthlyCents(grossMonthlyCents: MoneyCents): MoneyCents {
  if (grossMonthlyCents <= 0) {
    return 0;
  }
  return Math.round(grossMonthlyCents * 0.015);
}
