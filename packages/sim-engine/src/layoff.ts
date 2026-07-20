import type { CareerState, MacroState } from '@fad/shared';

/** BLS JOLTS baseline monthly flow rate (data/calibration/2026.1.json). */
export const BASELINE_MONTHLY_LAYOFF_RATE = 0.011;

export interface LayoffRollResult {
  laidOff: boolean;
  career: CareerState;
}

export function monthlyLayoffHazard(career: CareerState, macro: MacroState): number {
  if (career.employmentType !== 'w2') {
    return 0;
  }
  if (career.tenureMonths < 6) {
    return 0;
  }
  return BASELINE_MONTHLY_LAYOFF_RATE * macro.layoffClimate;
}

export function rollLayoff(
  career: CareerState,
  macro: MacroState,
  rng: () => number,
): LayoffRollResult {
  const hazard = monthlyLayoffHazard(career, macro);
  const laidOff = hazard > 0 && rng() < hazard;

  if (laidOff) {
    const severe = rng() < 0.7;
    const salaryResetPct = severe ? 0.15 : 0;
    return {
      laidOff: true,
      career: {
        ...career,
        employmentType: 'unemployed',
        baseSalaryAnnual: Math.round(career.baseSalaryAnnual * (1 - salaryResetPct)),
        unemploymentWeeks: 0,
      },
    };
  }

  return {
    laidOff: false,
    career: {
      ...career,
      tenureMonths: career.tenureMonths + 1,
    },
  };
}
