import type { CareerSector, HousingMode, MoneyCents, UsStateCode } from './game-state.js';
import type { V1HousingArrangement, V1MaritalStatus } from './housing-rent.js';
import {
  defaultHousingArrangement,
  isHousingArrangementAllowed,
} from './housing-rent.js';
import type { V1StarterScenarioId } from './v1-scenarios.js';

export type { V1HousingArrangement, V1MaritalStatus } from './housing-rent.js';

/** Eight V0 states with distinct tax profiles (see packages/data v0-rent-only). */
export const V1_CHARACTER_STATES: readonly UsStateCode[] = [
  'CA',
  'FL',
  'NY',
  'TX',
  'WA',
  'NC',
  'TN',
  'IL',
] as const;

export type V1AgeBand = '22' | '25' | '28' | '30';

export type V1EducationTier = 'target' | 'non_target';

export type V1DeliveryFrequency = 'none' | 'low' | 'medium' | 'high';

export type V1CookingSkill = 0 | 1 | 2 | 3;

export interface V1BalanceSheetDraft {
  checking: MoneyCents;
  hysa: MoneyCents;
  /** Taxable brokerage; defaults to $0 unless scenario or player sets it. */
  brokerage: MoneyCents;
  rothIra: MoneyCents;
  traditional401k: MoneyCents;
  studentLoan: MoneyCents;
  creditCard: MoneyCents;
}

/** Rental listing chosen on /create/rental before simulation starts. */
export interface V1RentalListingSelection {
  listingId: string;
  address: string;
  neighborhood: string;
  city: string;
  beds: number;
  baths: number;
  /** Full market rent before roommate or partner split. */
  marketRentMonthly: MoneyCents;
}

export type LifePriorityId = 'wealth' | 'freedom' | 'stability' | 'experience' | 'family';

export interface V1CharacterDraft {
  scenarioId: V1StarterScenarioId;
  name: string;
  /** Slim setup hides advanced balance sheet fields. */
  setupMode?: 'slim' | 'advanced';
  lifePriorities?: LifePriorityId[];
  ageBand: V1AgeBand;
  stateCode: UsStateCode;
  educationTier: V1EducationTier;
  careerSector: CareerSector;
  maritalStatus: V1MaritalStatus;
  /** Rent and utilities split applied to market rent at game start. */
  housingArrangement: V1HousingArrangement;
  /** Rent vs own stub; own posts PITI instead of rent on monthly tick. */
  housingMode: HousingMode;
  relationshipSimulation: boolean;
  /** Annual partner W2 salary in cents; 0 when single or no partner income. */
  partnerIncomeAnnual: MoneyCents;
  /** Dependents count (0-3). Childcare expense posts when > 0. */
  dependentsCount: number;
  /** When single, enable dependents planning in character creator. */
  childrenPlanned: boolean;
  /** Include employer health plan premium in monthly living expenses (default on for W2). */
  includeEmployerHealthPlan: boolean;
  habits: {
    deliveryFrequency: V1DeliveryFrequency;
    cookingSkill: V1CookingSkill;
  };
  balanceSheet: V1BalanceSheetDraft;
  /** Set when the player picks a lease on /create/rental. */
  rentalSelection?: V1RentalListingSelection;
}

export interface TraitOption<T extends string | number> {
  value: T;
  label: string;
  modifier: string;
}

export const V1_AGE_BAND_OPTIONS: readonly TraitOption<V1AgeBand>[] = [
  { value: '22', label: '22', modifier: 'Fresh grad, lower runway expectations' },
  { value: '25', label: '25', modifier: 'Early career, some savings history' },
  { value: '28', label: '28', modifier: 'Mid-twenties pivot window' },
  { value: '30', label: '30', modifier: 'Established earnings band' },
] as const;

export const V1_STATE_OPTIONS: readonly TraitOption<UsStateCode>[] = [
  { value: 'CA', label: 'California', modifier: 'High rent, progressive state tax' },
  { value: 'FL', label: 'Florida', modifier: 'No state income tax, hurricane risk' },
  { value: 'NY', label: 'New York', modifier: 'High rent, NYC vs upstate spread' },
  { value: 'TX', label: 'Texas', modifier: 'No state income tax, sprawl commute' },
  { value: 'WA', label: 'Washington', modifier: 'No state income tax, tech hubs' },
  { value: 'NC', label: 'North Carolina', modifier: 'Moderate tax, growing metros' },
  { value: 'TN', label: 'Tennessee', modifier: 'No state income tax, lower COL' },
  { value: 'IL', label: 'Illinois', modifier: 'Flat state tax, Chicago rent' },
] as const;

export const V1_EDUCATION_OPTIONS: readonly TraitOption<V1EducationTier>[] = [
  { value: 'target', label: 'Target school', modifier: 'Strong campus recruiting pipeline' },
  { value: 'non_target', label: 'Non-target school', modifier: 'Harder offers, cert upside' },
] as const;

export const V1_CAREER_OPTIONS: readonly TraitOption<CareerSector>[] = [
  { value: 'tech', label: 'Technology', modifier: 'High comp, layoff exposure' },
  { value: 'finance', label: 'Finance', modifier: 'Bonus-heavy, long hours' },
  { value: 'medicine', label: 'Medicine', modifier: 'Debt now, peak earnings later' },
  { value: 'public_service', label: 'Public service', modifier: 'Stable pay, loan forgiveness paths' },
  { value: 'consulting', label: 'Consulting', modifier: 'Travel-heavy, fast promotion ladder' },
] as const;

export const V1_MARITAL_OPTIONS: readonly TraitOption<V1MaritalStatus>[] = [
  { value: 'single', label: 'Single', modifier: 'Individual finances only' },
  { value: 'partnered', label: 'Partnered', modifier: 'Shared expenses optional' },
  { value: 'married', label: 'Married', modifier: 'Joint decisions, dual income potential' },
] as const;

export const V1_HOUSING_ARRANGEMENT_OPTIONS: readonly TraitOption<V1HousingArrangement>[] = [
  { value: 'roommates_4', label: '4 roommates', modifier: 'Rent and utilities split four ways' },
  { value: 'roommate_1', label: '1 roommate', modifier: 'Rent and utilities split in half' },
  { value: 'solo', label: 'Solo lease', modifier: 'You pay full market rent' },
  {
    value: 'partner_split',
    label: 'Split with partner',
    modifier: 'Shared lease, 50/50 rent and utilities',
  },
  {
    value: 'pay_alone',
    label: 'Pay alone',
    modifier: 'Partnered but separate lease, full rent',
  },
] as const;

export function housingOptionsForMaritalStatus(
  maritalStatus: V1MaritalStatus,
): readonly TraitOption<V1HousingArrangement>[] {
  return V1_HOUSING_ARRANGEMENT_OPTIONS.filter((option) =>
    isHousingArrangementAllowed(option.value, maritalStatus),
  );
}

export const V1_DELIVERY_OPTIONS: readonly TraitOption<V1DeliveryFrequency>[] = [
  { value: 'none', label: 'Rarely', modifier: 'Minimal food delivery spend' },
  { value: 'low', label: 'Occasionally', modifier: 'Small convenience tax' },
  { value: 'medium', label: 'Weekly', modifier: 'Noticeable monthly drag' },
  { value: 'high', label: 'Most nights', modifier: 'Major discretionary leak' },
] as const;

export const V1_COOKING_OPTIONS: readonly TraitOption<V1CookingSkill>[] = [
  { value: 0, label: 'Takeout only', modifier: 'Highest food spend baseline' },
  { value: 1, label: 'Basics', modifier: 'Some home meals, still delivery-prone' },
  { value: 2, label: 'Competent', modifier: 'Regular meal prep savings' },
  { value: 3, label: 'Expert', modifier: 'Low food waste, batch cooking' },
] as const;

const DEFAULT_BALANCE: V1BalanceSheetDraft = {
  checking: 2_000_00,
  hysa: 1_000_00,
  brokerage: 0,
  rothIra: 0,
  traditional401k: 0,
  studentLoan: 25_000_00,
  creditCard: 500_00,
};

const SCENARIO_DEFAULTS: Partial<
  Record<V1StarterScenarioId, Partial<Omit<V1CharacterDraft, 'scenarioId' | 'balanceSheet'>> & {
    balanceSheet?: Partial<V1BalanceSheetDraft>;
  }>
> = {
  'class-of-2026': {
    ageBand: '22',
    educationTier: 'target',
    careerSector: 'tech',
    maritalStatus: 'single',
    habits: { deliveryFrequency: 'medium', cookingSkill: 1 },
    balanceSheet: {
      checking: 2_000_00,
      hysa: 500_00,
      studentLoan: 28_000_00,
      creditCard: 800_00,
    },
  },
  'non-target-climb': {
    ageBand: '25',
    educationTier: 'non_target',
    careerSector: 'consulting',
    habits: { deliveryFrequency: 'low', cookingSkill: 2 },
    balanceSheet: {
      checking: 1_500_00,
      hysa: 800_00,
      studentLoan: 35_000_00,
      creditCard: 1_200_00,
    },
  },
  'tech-reset': {
    ageBand: '28',
    educationTier: 'target',
    careerSector: 'tech',
    habits: { deliveryFrequency: 'low', cookingSkill: 2 },
    balanceSheet: {
      checking: 8_000_00,
      hysa: 15_000_00,
      brokerage: 25_000_00,
      rothIra: 12_000_00,
      traditional401k: 45_000_00,
      studentLoan: 18_000_00,
      creditCard: 2_000_00,
    },
  },
  'medical-road': {
    ageBand: '25',
    educationTier: 'non_target',
    careerSector: 'medicine',
    habits: { deliveryFrequency: 'high', cookingSkill: 0 },
    balanceSheet: {
      checking: 800_00,
      hysa: 200_00,
      studentLoan: 180_000_00,
      creditCard: 3_500_00,
    },
  },
  'gig-economy': {
    ageBand: '25',
    educationTier: 'non_target',
    careerSector: 'public_service',
    habits: { deliveryFrequency: 'medium', cookingSkill: 1 },
    balanceSheet: {
      checking: 1_200_00,
      hysa: 300_00,
      studentLoan: 15_000_00,
      creditCard: 2_500_00,
    },
  },
};

export function getDefaultV1CharacterDraft(scenarioId: V1StarterScenarioId): V1CharacterDraft {
  const overrides = SCENARIO_DEFAULTS[scenarioId] ?? {};
  const balanceOverrides = overrides.balanceSheet ?? {};

  return {
    scenarioId,
    name: '',
    setupMode: 'slim',
    lifePriorities: ['stability', 'wealth'],
    ageBand: overrides.ageBand ?? '25',
    stateCode: 'NY',
    educationTier: overrides.educationTier ?? 'target',
    careerSector: overrides.careerSector ?? 'tech',
    maritalStatus: overrides.maritalStatus ?? 'single',
    housingArrangement:
      overrides.housingArrangement ?? defaultHousingArrangement(overrides.maritalStatus ?? 'single'),
    housingMode: overrides.housingMode ?? 'rent',
    relationshipSimulation: false,
    partnerIncomeAnnual: 0,
    dependentsCount: 0,
    childrenPlanned: false,
    includeEmployerHealthPlan: true,
    habits: overrides.habits ?? { deliveryFrequency: 'low', cookingSkill: 1 },
    balanceSheet: { ...DEFAULT_BALANCE, ...balanceOverrides },
  };
}

export function dollarsToCents(dollars: number): MoneyCents {
  if (!Number.isFinite(dollars)) return 0;
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: MoneyCents): number {
  return cents / 100;
}

/** Assets minus liabilities from the character creator balance sheet draft. */
export function balanceSheetNetWorth(sheet: V1BalanceSheetDraft): MoneyCents {
  const assets =
    sheet.checking +
    sheet.hysa +
    sheet.brokerage +
    sheet.rothIra +
    sheet.traditional401k;
  const liabilities = sheet.studentLoan + sheet.creditCard;
  return assets - liabilities;
}
