import type {
  Accounts,
  CareerSector,
  CareerState,
  Debts,
  IsoDate,
  LocationState,
  UsStateCode,
} from '@fad/shared';
import {
  metroIdForState,
  sampleMarketRentMonthly,
} from '../calibration/housing/col-tiers.js';

/** Eight V0 states with distinct tax profiles (see feature-set L. State Tax). */
export const V0_SCENARIO_STATES: readonly UsStateCode[] = [
  'CA',
  'FL',
  'NY',
  'TX',
  'WA',
  'NC',
  'TN',
  'IL',
] as const;

export const V0_SCENARIO_CAREERS: readonly CareerSector[] = [
  'tech',
  'finance',
  'medicine',
  'public_service',
  'consulting',
] as const;

export interface V0ScenarioConfig {
  id: string;
  career: CareerSector;
  stateCode: UsStateCode;
  randomSeed: string;
}

const CAREER_PROFILES: Record<
  CareerSector,
  { title: string; baseSalaryAnnual: number; deferral401kRate: number }
> = {
  tech: { title: 'Software Engineer', baseSalaryAnnual: 120_000_00, deferral401kRate: 0.06 },
  finance: { title: 'Financial Analyst', baseSalaryAnnual: 110_000_00, deferral401kRate: 0.05 },
  medicine: { title: 'Resident Physician', baseSalaryAnnual: 68_000_00, deferral401kRate: 0.04 },
  public_service: { title: 'Policy Analyst', baseSalaryAnnual: 65_000_00, deferral401kRate: 0.03 },
  consulting: { title: 'Associate Consultant', baseSalaryAnnual: 95_000_00, deferral401kRate: 0.05 },
};

const DEFAULT_START_DATE: IsoDate = '2026-01-01';

function defaultAccounts(): Accounts {
  return {
    checking: { id: 'checking', balance: 1_500_000 },
    hysa: { id: 'hysa', balance: 1_000_000 },
    brokerage: { id: 'brokerage', balance: 2_500_000 },
    rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
    traditional401k: { id: '401k', balance: 500_000, taxYearContributions: 0 },
  };
}

function defaultDebts(): Debts {
  return {
    creditCards: [
      {
        id: 'cc1',
        balance: 50_000,
        limit: 500_000,
        apr: 0.2199,
        minimumPayment: 2_500,
      },
    ],
    studentLoans: [
      {
        id: 'sl1',
        principal: 2_500_000,
        apr: 0.055,
        minimumPayment: 28_000,
      },
    ],
    mortgages: [],
  };
}

export function buildV0ScenarioMatrix(): V0ScenarioConfig[] {
  const scenarios: V0ScenarioConfig[] = [];
  for (const career of V0_SCENARIO_CAREERS) {
    for (const stateCode of V0_SCENARIO_STATES) {
      scenarios.push({
        id: `${career}_${stateCode.toLowerCase()}`,
        career,
        stateCode,
        randomSeed: `v0-scenario-${career}-${stateCode.toLowerCase()}`,
      });
    }
  }
  return scenarios;
}

export interface V0ScenarioFixture {
  config: V0ScenarioConfig;
  startDate: IsoDate;
  months: number;
  accounts: Accounts;
  debts: Debts;
  career: CareerState;
  location: LocationState;
  deferral401kRate: number;
}

/**
 * Builds a rent-only scenario fixture. Market rent is sampled once from the
 * state COL tier band (seeded). Career salary bands are independent of rent draw.
 */
export function buildV0ScenarioFixture(config: V0ScenarioConfig): V0ScenarioFixture {
  const profile = CAREER_PROFILES[config.career];
  const marketRentMonthly = sampleMarketRentMonthly(config.stateCode, config.randomSeed);

  return {
    config,
    startDate: DEFAULT_START_DATE,
    months: 6,
    accounts: defaultAccounts(),
    debts: defaultDebts(),
    career: {
      sector: config.career,
      title: profile.title,
      employmentType: 'w2',
      baseSalaryAnnual: profile.baseSalaryAnnual,
      tenureMonths: 12,
      unemploymentWeeks: 0,
    },
    location: {
      stateCode: config.stateCode,
      metroId: metroIdForState(config.stateCode),
      housingMode: 'rent',
      marketRentMonthly,
      rentPaymentMonthly: marketRentMonthly,
    },
    deferral401kRate: profile.deferral401kRate,
  };
}

/** Pre-built matrix of all 5 careers x 8 states (40 scenarios). */
export const V0_SCENARIO_MATRIX: V0ScenarioConfig[] = buildV0ScenarioMatrix();
