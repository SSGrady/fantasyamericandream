import type {
  Accounts,
  CareerSector,
  CareerState,
  Debts,
  IsoDate,
  LocationState,
  UsStateCode,
} from '@fad/shared';

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

const STATE_METRO_RENT: Record<UsStateCode, { metroId: string; rentPaymentMonthly: number }> = {
  CA: { metroId: 'los_angeles', rentPaymentMonthly: 250_000 },
  FL: { metroId: 'miami', rentPaymentMonthly: 180_000 },
  NY: { metroId: 'new_york_city', rentPaymentMonthly: 280_000 },
  TX: { metroId: 'austin', rentPaymentMonthly: 150_000 },
  WA: { metroId: 'seattle', rentPaymentMonthly: 220_000 },
  NC: { metroId: 'charlotte', rentPaymentMonthly: 140_000 },
  TN: { metroId: 'nashville', rentPaymentMonthly: 130_000 },
  IL: { metroId: 'chicago', rentPaymentMonthly: 190_000 },
  GA: { metroId: 'atlanta', rentPaymentMonthly: 160_000 },
  SC: { metroId: 'charleston', rentPaymentMonthly: 135_000 },
};

const DEFAULT_START_DATE: IsoDate = '2026-01-01';

function defaultAccounts(): Accounts {
  return {
    checking: { id: 'checking', balance: 500_000 },
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

export function buildV0ScenarioFixture(config: V0ScenarioConfig): V0ScenarioFixture {
  const profile = CAREER_PROFILES[config.career];
  const locationMeta = STATE_METRO_RENT[config.stateCode];

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
      metroId: locationMeta.metroId,
      housingMode: 'rent',
      marketRentMonthly: locationMeta.rentPaymentMonthly,
      rentPaymentMonthly: locationMeta.rentPaymentMonthly,
    },
    deferral401kRate: profile.deferral401kRate,
  };
}

/** Pre-built matrix of all 5 careers x 8 states (40 scenarios). */
export const V0_SCENARIO_MATRIX: V0ScenarioConfig[] = buildV0ScenarioMatrix();
