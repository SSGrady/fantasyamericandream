import type { MoneyCents } from './game-state.js';
import type { V1MaritalStatus } from './v1-character-draft.js';

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
    dependentsCount: 0,
    partner,
    financeMode: input.maritalStatus === 'married' ? 'joint' : 'individual',
    relationshipHealth: 75,
  };
}
