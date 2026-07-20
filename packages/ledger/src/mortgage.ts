import type { LedgerTransaction, MoneyCents } from '@fad/shared';

/** Matches MORTGAGE_RATES_2026.baseRate in packages/data (avoid ledger → data dependency). */
const DEFAULT_MORTGAGE_APR = 0.0655;

export interface MortgagePitiStubInput {
  homeValueCents: MoneyCents;
  downPaymentPct?: number;
  apr?: number;
}

export interface MortgagePitiStubResult {
  principal: MoneyCents;
  downPayment: MoneyCents;
  monthlyPiti: MoneyCents;
  pmiMonthly: MoneyCents;
  monthlyPrincipalAndInterest: MoneyCents;
}

function roundCents(value: number): MoneyCents {
  return Math.round(value);
}

/** V0 homeownership stub: 30-year fixed, 20% down default, PMI when LTV > 80%. */
export function computeMortgagePitiStub(input: MortgagePitiStubInput): MortgagePitiStubResult {
  const downPaymentPct = input.downPaymentPct ?? 0.2;
  const apr = input.apr ?? DEFAULT_MORTGAGE_APR;
  const downPayment = roundCents(input.homeValueCents * downPaymentPct);
  const principal = input.homeValueCents - downPayment;
  const ltv = input.homeValueCents > 0 ? principal / input.homeValueCents : 0;

  const monthlyRate = apr / 12;
  const termMonths = 360;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPrincipalAndInterest =
    monthlyRate === 0
      ? roundCents(principal / termMonths)
      : roundCents((principal * monthlyRate * factor) / (factor - 1));

  const pmiMonthly = ltv > 0.8 ? roundCents((principal * 0.005) / 12) : 0;
  const propertyTaxMonthly = roundCents((input.homeValueCents * 0.012) / 12);
  const insuranceMonthly = 150_00;
  const monthlyPiti =
    monthlyPrincipalAndInterest + propertyTaxMonthly + insuranceMonthly + pmiMonthly;

  return {
    principal,
    downPayment,
    monthlyPiti,
    pmiMonthly,
    monthlyPrincipalAndInterest,
  };
}

export function buildMortgagePitiTransaction(
  monthKey: string,
  monthlyPiti: MoneyCents,
): LedgerTransaction {
  return {
    id: `tx-${monthKey}-mortgage-piti`,
    description: 'Monthly mortgage PITI',
    source: 'expense',
    lines: [
      { accountId: 'expense:mortgagePiti', debitCents: monthlyPiti, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: monthlyPiti },
    ],
  };
}
