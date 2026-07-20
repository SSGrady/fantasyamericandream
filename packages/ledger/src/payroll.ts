import { IRS_LIMITS_2026 } from '@fad/data';
import type { Accounts, LedgerTransaction, MoneyCents } from '@fad/shared';

/** V0 payroll stub rates. Promote to calibration when brackets are modeled. */
export const PAYROLL_STUB_2026 = {
  federalWithholdingRate: 0.15,
  ficaSocialSecurityRate: 0.062,
  ficaMedicareRate: 0.0145,
  socialSecurityWageBaseCents: 176_100_00,
} as const;

export interface GrossToNetInput {
  grossMonthlyCents: MoneyCents;
  requestedDeferral401kCents: MoneyCents;
  taxYear401kContributions: MoneyCents;
  ytdTaxableWagesCents?: MoneyCents;
}

export interface GrossToNetResult {
  grossMonthlyCents: MoneyCents;
  federalWithholdingCents: MoneyCents;
  ficaSocialSecurityCents: MoneyCents;
  ficaMedicareCents: MoneyCents;
  deferral401kCents: MoneyCents;
  netPayCents: MoneyCents;
}

function roundCents(value: number): MoneyCents {
  return Math.round(value);
}

export function grossToNet(input: GrossToNetInput): GrossToNetResult {
  const {
    grossMonthlyCents,
    requestedDeferral401kCents,
    taxYear401kContributions,
    ytdTaxableWagesCents = 0,
  } = input;

  if (!Number.isInteger(grossMonthlyCents) || grossMonthlyCents < 0) {
    throw new Error('grossMonthlyCents must be a non-negative integer');
  }

  const federalWithholdingCents = roundCents(
    grossMonthlyCents * PAYROLL_STUB_2026.federalWithholdingRate,
  );

  const remainingSsWageBase = Math.max(
    0,
    PAYROLL_STUB_2026.socialSecurityWageBaseCents - ytdTaxableWagesCents,
  );
  const ssTaxableWages = Math.min(grossMonthlyCents, remainingSsWageBase);
  const ficaSocialSecurityCents = roundCents(
    ssTaxableWages * PAYROLL_STUB_2026.ficaSocialSecurityRate,
  );
  const ficaMedicareCents = roundCents(grossMonthlyCents * PAYROLL_STUB_2026.ficaMedicareRate);

  const deferralRoom = Math.max(
    0,
    IRS_LIMITS_2026.employee401kDeferral - taxYear401kContributions,
  );
  const deferral401kCents = Math.min(requestedDeferral401kCents, deferralRoom, grossMonthlyCents);

  const netPayCents =
    grossMonthlyCents -
    federalWithholdingCents -
    ficaSocialSecurityCents -
    ficaMedicareCents -
    deferral401kCents;

  if (netPayCents < 0) {
    throw new Error('Net pay cannot be negative after deductions');
  }

  return {
    grossMonthlyCents,
    federalWithholdingCents,
    ficaSocialSecurityCents,
    ficaMedicareCents,
    deferral401kCents,
    netPayCents,
  };
}

export interface BuildPayrollTransactionInput {
  monthKey: string;
  grossMonthlyCents: MoneyCents;
  payroll: GrossToNetResult;
}

export function buildPayrollTransaction(input: BuildPayrollTransactionInput): LedgerTransaction {
  const { monthKey, grossMonthlyCents, payroll } = input;
  const txId = `tx-${monthKey}-payroll`;

  const lines: LedgerTransaction['lines'] = [
    { accountId: 'checking', debitCents: payroll.netPayCents, creditCents: 0 },
    { accountId: 'income:salary', debitCents: 0, creditCents: grossMonthlyCents },
  ];

  if (payroll.deferral401kCents > 0) {
    lines.push({
      accountId: 'traditional401k',
      debitCents: payroll.deferral401kCents,
      creditCents: 0,
    });
  }

  if (payroll.federalWithholdingCents > 0) {
    lines.push({
      accountId: 'expense:federalWithholding',
      debitCents: payroll.federalWithholdingCents,
      creditCents: 0,
    });
  }

  const ficaTotal = payroll.ficaSocialSecurityCents + payroll.ficaMedicareCents;
  if (ficaTotal > 0) {
    lines.push({
      accountId: 'expense:fica',
      debitCents: ficaTotal,
      creditCents: 0,
    });
  }

  return {
    id: txId,
    description: 'Monthly W2 payroll',
    source: 'income',
    lines,
  };
}

export function monthlyGrossFromAnnual(baseSalaryAnnual: MoneyCents): MoneyCents {
  return roundCents(baseSalaryAnnual / 12);
}

export function buildPayrollFromCareer(
  monthKey: string,
  baseSalaryAnnual: MoneyCents,
  accounts: Accounts,
  deferral401kRate = 0.06,
): LedgerTransaction {
  const grossMonthlyCents = monthlyGrossFromAnnual(baseSalaryAnnual);
  const requestedDeferral401kCents = roundCents(grossMonthlyCents * deferral401kRate);
  const payroll = grossToNet({
    grossMonthlyCents,
    requestedDeferral401kCents,
    taxYear401kContributions: accounts.traditional401k.taxYearContributions,
  });

  return buildPayrollTransaction({ monthKey, grossMonthlyCents, payroll });
}
