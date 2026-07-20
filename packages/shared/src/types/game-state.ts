/** Integer cents - display formatting happens at UI boundary */
export type MoneyCents = number;

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

export interface LocationState {
  stateCode: UsStateCode;
  metroId: string;
  housingMode: 'rent';
  rentPaymentMonthly: MoneyCents;
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

export interface Debts {
  creditCards: CreditCardDebt[];
  studentLoans: TermDebt[];
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

export interface AuditSnapshot {
  asOf: IsoDate;
  netWorth: MoneyCents;
  netWorthDelta: MoneyCents;
  waterfall: NetWorthWaterfallLine[];
  /** Net pay deposited to checking from W2 payroll over the audit period. */
  periodNetPayCents: MoneyCents;
  savingsRate: number;
  emergencyRunwayMonths: number;
  contributionProgress: Record<string, ContributionProgress>;
}

import type { HouseholdState } from './household-state.js';

export interface GameState {
  run: SimulationRun;
  player: PlayerState;
  career: CareerState;
  household: HouseholdState;
  location: LocationState;
  accounts: Accounts;
  debts: Debts;
  macro: MacroState;
}
