import type { MoneyCents } from './game-state.js';
import type { V1MaritalStatus } from './v1-character-draft.js';

/** Maximum dependents selectable in character creator (V2 stub). */
export const MAX_DEPENDENTS_COUNT = 3;

/** Stub childcare band: $800/mo per dependent (calibration TBD). */
export const CHILDCARE_MONTHLY_PER_CHILD_CENTS = 800_00;

export function childcareMonthlyCents(dependentsCount: number): MoneyCents {
  if (dependentsCount <= 0) {
    return 0;
  }
  return dependentsCount * CHILDCARE_MONTHLY_PER_CHILD_CENTS;
}

export function clampDependentsCount(count: number): number {
  return Math.min(MAX_DEPENDENTS_COUNT, Math.max(0, Math.round(count)));
}

export interface PartnerState {
  employmentType: 'w2' | 'unemployed';
  baseSalaryAnnual: MoneyCents;
  /** Partner 401(k) deferral rate stub (0-1). */
  deferral401kRate: number;
}

export interface HouseholdState {
  maritalStatus: V1MaritalStatus;
  dependentsCount: number;
  partner?: PartnerState;
  financeMode: 'individual' | 'joint';
  /** 0-100; divorce simulation input in V2. */
  relationshipHealth: number;
}

export const DEFAULT_HOUSEHOLD: HouseholdState = {
  maritalStatus: 'single',
  dependentsCount: 0,
  financeMode: 'individual',
  relationshipHealth: 75,
};

export function buildHouseholdFromDraft(input: {
  maritalStatus: V1MaritalStatus;
  partnerIncomeAnnual: MoneyCents;
  dependentsCount?: number;
}): HouseholdState {
  const partner =
    input.maritalStatus !== 'single' && input.partnerIncomeAnnual > 0
      ? {
          employmentType: 'w2' as const,
          baseSalaryAnnual: input.partnerIncomeAnnual,
          deferral401kRate: 0.05,
        }
      : undefined;

  return {
    maritalStatus: input.maritalStatus,
    dependentsCount: clampDependentsCount(input.dependentsCount ?? 0),
    partner,
    financeMode: input.maritalStatus === 'married' ? 'joint' : 'individual',
    relationshipHealth: 75,
  };
}
