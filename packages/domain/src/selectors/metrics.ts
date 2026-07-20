import { netWorth } from '@fad/ledger';
import type {
  AuditSnapshot,
  ContributionProgress,
  GameState,
  NetWorthAttribution,
} from '@fad/shared';
import type { RunState } from '../run-state/types.js';

export interface RibbonMetrics {
  startNetWorth: number;
  netWorth: number;
  netWorthDelta: number;
  takeHomePayMonthly: number;
  deferral401kRate: number;
  cashSurplusRate: number;
  savingsRate: number;
  emergencyRunwayMonths: number;
  housingBurdenPct: number;
  dti: number;
}

/** Canonical audit for chapter-close surfaces: impact preview chosen path when present. */
export function selectCanonicalAudit(state: RunState): AuditSnapshot | null {
  return state.impactPreview?.chosenAudit ?? state.currentAudit;
}

export function selectNetWorth(state: RunState): number {
  const audit = selectCanonicalAudit(state);
  if (audit) return audit.netWorth;
  return netWorth(state.gameState.accounts, state.gameState.debts);
}

export function selectLiquidRunway(state: RunState): number {
  const audit = selectCanonicalAudit(state);
  if (audit) return audit.emergencyRunwayMonths;
  const checking = state.gameState.accounts.checking.balance;
  const monthlyBurn = Math.max(state.gameState.location.rentPaymentMonthly, 1);
  return checking / monthlyBurn;
}

export function selectContributionProgress(state: RunState): Record<string, ContributionProgress> {
  const audit = selectCanonicalAudit(state);
  if (audit?.contributionProgress) return audit.contributionProgress;
  return {};
}

export function selectChoiceAttribution(state: RunState): NetWorthAttribution | null {
  const audit = selectCanonicalAudit(state);
  return audit?.attribution ?? null;
}

export function selectRibbonMetrics(state: RunState, periodMonths = 6): RibbonMetrics {
  const audit = selectCanonicalAudit(state);
  if (!audit) {
    const nw = selectNetWorth(state);
    return {
      startNetWorth: state.startingNetWorth,
      netWorth: nw,
      netWorthDelta: nw - state.startingNetWorth,
      takeHomePayMonthly: 0,
      deferral401kRate: state.deferral401kRate,
      cashSurplusRate: 0,
      savingsRate: 0,
      emergencyRunwayMonths: selectLiquidRunway(state),
      housingBurdenPct: 0,
      dti: 0,
    };
  }

  const periodNetPay = audit.periodNetPayCents;
  const monthlyNetPay = periodNetPay > 0 ? periodNetPay / periodMonths : 0;
  const rentLine = audit.waterfall.find((line) => line.label === 'Rent');
  const periodRent = rentLine
    ? Math.abs(rentLine.amount)
    : state.gameState.location.rentPaymentMonthly * periodMonths;
  const monthlyRentShare = periodRent / periodMonths;
  const housingBurdenPct = monthlyNetPay > 0 ? monthlyRentShare / monthlyNetPay : 0;
  const monthlyDebt =
    state.gameState.debts.creditCards.reduce((sum, card) => sum + card.minimumPayment, 0) +
    state.gameState.debts.studentLoans.reduce((sum, loan) => sum + loan.minimumPayment, 0);
  const dti = monthlyNetPay > 0 ? monthlyDebt / monthlyNetPay : 0;

  return {
    startNetWorth: audit.startNetWorth,
    netWorth: audit.netWorth,
    netWorthDelta: audit.netWorthDelta,
    takeHomePayMonthly: monthlyNetPay,
    deferral401kRate: audit.deferral401kRate ?? state.deferral401kRate,
    cashSurplusRate: audit.cashSurplusRate ?? 0,
    savingsRate: audit.savingsRate,
    emergencyRunwayMonths: audit.emergencyRunwayMonths,
    housingBurdenPct,
    dti,
  };
}
