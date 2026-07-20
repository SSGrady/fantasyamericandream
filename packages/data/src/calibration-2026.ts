export interface IrsLimits2026 {
  employee401kDeferral: number;
  iraContribution: number;
  hsaIndividual: number;
  hsaFamily: number;
}

export const IRS_LIMITS_2026: IrsLimits2026 = {
  employee401kDeferral: 2_450_000, // $24,500 in cents
  iraContribution: 750_000,
  hsaIndividual: 430_000,
  hsaFamily: 855_000,
};

export interface MortgageRateBand {
  baseRate: number;
  stressHigh: number;
  source: string;
  asOf: string;
}

export const MORTGAGE_RATES_2026: MortgageRateBand = {
  baseRate: 0.0655,
  stressHigh: 0.08,
  source: 'Freddie Mac PMMS',
  asOf: '2026-07-16',
};
