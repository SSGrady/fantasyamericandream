import type { CareerState, LedgerTransaction, MoneyCents } from '@fad/shared';
import {
  DEFAULT_TERM_LIFE_COVERAGE_CENTS,
  disabilityPremiumMonthlyCents,
  termLifePremiumMonthlyCents,
} from '@fad/shared';
import { monthlyGrossFromAnnual } from './payroll.js';

export const INSURANCE_EXPENSE_ACCOUNT_IDS = {
  termLife: 'expense:termLife',
  disability: 'expense:disabilityInsurance',
} as const;

export interface InsurancePremiumInput {
  monthKey: string;
  ageYears: number;
  career: Pick<CareerState, 'employmentType' | 'baseSalaryAnnual'>;
  termLifeEnabled: boolean;
  disabilityEnabled: boolean;
  termLifeCoverageCents?: MoneyCents;
}

export function buildTermLifePremiumTransaction(
  monthKey: string,
  ageYears: number,
  coverageCents: MoneyCents = DEFAULT_TERM_LIFE_COVERAGE_CENTS,
): LedgerTransaction | null {
  const amount = termLifePremiumMonthlyCents(ageYears, coverageCents);
  if (amount <= 0) {
    return null;
  }

  return {
    id: `tx-${monthKey}-term-life`,
    description: 'Term life insurance premium',
    source: 'expense',
    lines: [
      { accountId: INSURANCE_EXPENSE_ACCOUNT_IDS.termLife, debitCents: amount, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: amount },
    ],
  };
}

export function buildDisabilityPremiumTransaction(
  monthKey: string,
  grossMonthlyCents: MoneyCents,
): LedgerTransaction | null {
  const amount = disabilityPremiumMonthlyCents(grossMonthlyCents);
  if (amount <= 0) {
    return null;
  }

  return {
    id: `tx-${monthKey}-disability`,
    description: 'Disability insurance premium',
    source: 'expense',
    lines: [
      { accountId: INSURANCE_EXPENSE_ACCOUNT_IDS.disability, debitCents: amount, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: amount },
    ],
  };
}

export function buildInsurancePremiumTransactions(
  input: InsurancePremiumInput,
): LedgerTransaction[] {
  const transactions: LedgerTransaction[] = [];

  if (input.termLifeEnabled) {
    const termLife = buildTermLifePremiumTransaction(
      input.monthKey,
      input.ageYears,
      input.termLifeCoverageCents,
    );
    if (termLife) {
      transactions.push(termLife);
    }
  }

  if (
    input.disabilityEnabled &&
    input.career.employmentType === 'w2' &&
    input.career.baseSalaryAnnual > 0
  ) {
    const grossMonthly = monthlyGrossFromAnnual(input.career.baseSalaryAnnual);
    const disability = buildDisabilityPremiumTransaction(input.monthKey, grossMonthly);
    if (disability) {
      transactions.push(disability);
    }
  }

  return transactions;
}
