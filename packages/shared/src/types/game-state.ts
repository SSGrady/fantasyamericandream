/** Integer cents - display formatting happens at UI boundary */
export type MoneyCents = number;
export type { BrandedMoneyCents, BrandedBasisPoints, BrandedTaxYear } from './branded.js';
export { moneyCents, basisPoints, taxYear, parseMoneyCents, unwrapMoneyCents } from './branded.js';

import type { HouseholdState } from './household-state.js';
import type { V1HousingArrangement } from './housing-rent.js';

export type IsoDate = `${number}-${number}-${number}`;

export type UsStateCode =
  | 'CA'
  | 'FL'
  | 'GA'
  | 'IL'
  | 'NC'
  | 'NY'
  | 'SC'
  | 'TN'
  | 'TX'
  | 'WA';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SimulationEndReason =
  | 'age_65'
  | 'coast_fire'
  | 'voluntary'
  | 'insolvency'
  | 'bankruptcy';

export interface SimulationRun {
  id: string;
  simulationVersion: string;
  dataSnapshot: string;
  taxYear: number;
  randomSeed: string;
  difficulty: Difficulty;
  enabledModules: string[];
  startDate: IsoDate;
  currentDate: IsoDate;
  phase: 'active' | 'emergency' | 'ended';
  endReason?: SimulationEndReason;
}

export type CareerSector =
  | 'tech'
  | 'finance'
  | 'medicine'
  | 'public_service'
  | 'consulting';

export interface PlayerState {
  name: string;
  ageYears: number;
  birthDate: IsoDate;
  educationTier: 'target' | 'non_target' | 'graduate' | 'self_made';
  habits: {
    deliveryFrequency: 'none' | 'low' | 'medium' | 'high';
    cookingSkill: 0 | 1 | 2 | 3;
    subscriptionLoad: MoneyCents;
  };
  /** When true, posts employer health plan premium on monthly tick (W2 default). */
  includeEmployerHealthPlan: boolean;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface CareerState {
  sector: CareerSector;
  title: string;
  employmentType: 'w2' | 'contractor' | 'unemployed' | 'student';
  baseSalaryAnnual: MoneyCents;
  tenureMonths: number;
  unemploymentWeeks: number;
}

export type HousingMode = 'rent' | 'own';

export type TransportationMode = 'car' | 'transit' | 'mixed';

export interface LocationState {
  stateCode: UsStateCode;
  metroId: string;
  /** Car ownership vs public transit affects monthly costs and event eligibility. */
  transportationMode?: TransportationMode;
  housingMode: HousingMode;
  /** Full market rent before roommate or partner split. */
  marketRentMonthly: MoneyCents;
  /** Player's share posted to expense:rent each month. */
  rentPaymentMonthly: MoneyCents;
  housingArrangement?: V1HousingArrangement;
  /** Stub home value when housingMode is own (20% down, PITI on monthly tick). */
  homeValueCents?: MoneyCents;
}

export interface AccountBucket {
  id: string;
  balance: MoneyCents;
}

export interface TaxAdvantagedBucket extends AccountBucket {
  taxYearContributions: MoneyCents;
}

export interface Accounts {
  checking: AccountBucket;
  hysa: AccountBucket;
  brokerage: AccountBucket;
  rothIra: TaxAdvantagedBucket;
  traditional401k: TaxAdvantagedBucket;
  /** 529 education savings stub (V2 household). No contributions in stub. */
  plan529?: TaxAdvantagedBucket;
}

export interface CreditCardDebt {
  id: string;
  balance: MoneyCents;
  limit: MoneyCents;
  apr: number;
  minimumPayment: MoneyCents;
}

export interface TermDebt {
  id: string;
  principal: MoneyCents;
  apr: number;
  minimumPayment: MoneyCents;
}

export interface MortgageDebt {
  id: string;
  principal: MoneyCents;
  homeValue: MoneyCents;
  apr: number;
  termMonths: number;
  /** Total monthly PITI stub posted to checking. */
  monthlyPiti: MoneyCents;
  pmiMonthly: MoneyCents;
}

export interface Debts {
  creditCards: CreditCardDebt[];
  studentLoans: TermDebt[];
  mortgages: MortgageDebt[];
}

export type MacroRegime =
  | 'expansion'
  | 'slow_growth'
  | 'inflation_shock'
  | 'mild_recession'
  | 'severe_recession';

export interface MacroState {
  regime: MacroRegime;
  inflationAnnual: number;
  sp500ReturnYtd: number;
  mortgageRate30y: number;
  layoffClimate: number;
}

export interface NetWorthWaterfallLine {
  label: string;
  amount: MoneyCents;
  category: 'income' | 'expense' | 'growth' | 'debt' | 'other';
}

export interface ContributionProgress {
  contributedCents: MoneyCents;
  limitCents: MoneyCents;
  remainingCents: MoneyCents;
  pctOfLimit: number;
}

export interface MetricBreakdownLineSnapshot {
  label: string;
  amountCents: MoneyCents;
}

export interface SavingsRateBreakdownSnapshot {
  savingsInflowsCents: MoneyCents;
  periodNetPayCents: MoneyCents;
  /** Total savings rate (deferrals + transfers) / net pay. */
  rate: number;
  deferral401kRate: number;
  cashSurplusRate: number;
  deferral401kCents: MoneyCents;
  cashSurplusCents: MoneyCents;
  formula: string;
  lines: MetricBreakdownLineSnapshot[];
}

export interface HousingBurdenBreakdownSnapshot {
  periodRentShareCents: MoneyCents;
  periodNetPayCents: MoneyCents;
  monthlyRentShareCents: MoneyCents;
  monthlyNetPayCents: MoneyCents;
  rate: number;
  formula: string;
  lines: MetricBreakdownLineSnapshot[];
}

export interface EmergencyRunwayBreakdownSnapshot {
  checkingBalanceCents: MoneyCents;
  monthlyBurnCents: MoneyCents;
  months: number;
  formula: string;
  burnComponents: MetricBreakdownLineSnapshot[];
}

export interface MetricBreakdownSnapshot {
  savingsRate: SavingsRateBreakdownSnapshot;
  housingBurden: HousingBurdenBreakdownSnapshot;
  emergencyRunway: EmergencyRunwayBreakdownSnapshot;
}

/** Six-month net-worth change attribution (contributions, returns, lifestyle, choice vs luck). */
export interface NetWorthAttribution {
  /** Intentional savings deposits (401k deferrals + transfers). */
  contributionCents: MoneyCents;
  /** Investment returns across brokerage, 401(k), Roth. */
  returnCents: MoneyCents;
  /** Essential lifestyle and debt outflows reducing net worth. */
  lifestyleLeakageCents: MoneyCents;
  /** Player-controlled inflows (contributions + net pay retained as assets). */
  choiceCents: MoneyCents;
  /** Macro and market luck (investment returns in V1). */
  luckCents: MoneyCents;
  /** Unattributed remainder within integer rounding. */
  residualCents: MoneyCents;
  byAccount: Partial<Record<'traditional401k' | 'brokerage' | 'rothIra', MoneyCents>>;
}

export interface AuditSnapshot {
  asOf: IsoDate;
  /** Net worth at the start of this audit window (ledger state before period ticks). */
  startNetWorth: MoneyCents;
  netWorth: MoneyCents;
  netWorthDelta: MoneyCents;
  waterfall: NetWorthWaterfallLine[];
  /** Net pay deposited to checking from W2 payroll over the audit period. */
  periodNetPayCents: MoneyCents;
  /** Total savings inflows / net pay (deferrals + post-payday transfers). */
  savingsRate: number;
  /** 401(k) payroll deferrals / net pay. */
  deferral401kRate: number;
  /** Post-payday transfer inflows to savings accounts / net pay. */
  cashSurplusRate: number;
  emergencyRunwayMonths: number;
  contributionProgress: Record<string, ContributionProgress>;
  /** Investment return cents by account over the audit period (excludes contributions). */
  accountInvestmentReturns?: Partial<
    Record<'brokerage' | 'traditional401k' | 'rothIra', MoneyCents>
  >;
  /** Ledger-derived metric breakdown for impact analysis UI. */
  metricBreakdown?: MetricBreakdownSnapshot;
  /** Net-worth change attribution for audit and narrative. */
  attribution?: NetWorthAttribution;
}

export interface GameState {
  run: SimulationRun;
  player: PlayerState;
  career: CareerState;
  household: HouseholdState;
  location: LocationState;
  accounts: Accounts;
  debts: Debts;
  macro: MacroState;
  /** Active persistent commands for the current chapter (replay). */
  commandState?: import('./action-command.js').CommandState;
}
