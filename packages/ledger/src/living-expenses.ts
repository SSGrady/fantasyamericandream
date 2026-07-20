import type {
  CareerState,
  LedgerTransaction,
  MoneyCents,
  V1CookingSkill,
  V1DeliveryFrequency,
  V1HousingArrangement,
} from '@fad/shared';
import { housingArrangementFraction } from '@fad/shared';

/** V0 baseline living expense stubs (Payday Playbook calibration). */
export const LIVING_EXPENSE_STUB_2026 = {
  healthInsuranceSingleMonthly: 140_00,
  utilitiesBaseMonthly: 185_00,
  groceriesBaseMonthly: 600_00,
  /** Subscriptions + cell + gym ($40 + $55 + $110). */
  subscriptionsStubMonthly: 205_00,
} as const;

export const LIVING_EXPENSE_ACCOUNT_IDS = {
  healthInsurance: 'expense:healthInsurance',
  utilities: 'expense:utilities',
  groceries: 'expense:groceries',
  subscriptions: 'expense:subscriptions',
} as const;

export type LivingExpenseCategory = keyof typeof LIVING_EXPENSE_ACCOUNT_IDS;

export interface LivingExpensesInput {
  career: Pick<CareerState, 'employmentType' | 'baseSalaryAnnual'>;
  housingArrangement?: V1HousingArrangement;
  cookingSkill?: V1CookingSkill;
  deliveryFrequency?: V1DeliveryFrequency;
  includeEmployerHealthPlan?: boolean;
}

export interface MonthlyLivingExpenseAmounts {
  healthInsurance: MoneyCents;
  utilities: MoneyCents;
  groceries: MoneyCents;
  subscriptions: MoneyCents;
}

const COOKING_SKILL_MULTIPLIER: Record<V1CookingSkill, number> = {
  0: 1.5,
  1: 1,
  2: 0.85,
  3: 0.7,
};

const DELIVERY_FREQUENCY_MULTIPLIER: Record<V1DeliveryFrequency, number> = {
  none: 1,
  low: 1.05,
  medium: 1.15,
  high: 1.35,
};

function roundCents(value: number): MoneyCents {
  return Math.round(value);
}

export function computeGroceriesMonthlyCents(input: {
  cookingSkill?: V1CookingSkill;
  deliveryFrequency?: V1DeliveryFrequency;
}): MoneyCents {
  const cookingSkill = input.cookingSkill ?? 1;
  const deliveryFrequency = input.deliveryFrequency ?? 'low';
  const base = LIVING_EXPENSE_STUB_2026.groceriesBaseMonthly;
  const multiplier =
    COOKING_SKILL_MULTIPLIER[cookingSkill] * DELIVERY_FREQUENCY_MULTIPLIER[deliveryFrequency];
  return roundCents(base * multiplier);
}

export function computeMonthlyLivingExpenses(input: LivingExpensesInput): MonthlyLivingExpenseAmounts {
  const arrangement = input.housingArrangement ?? 'solo';
  const includeHealth =
    input.includeEmployerHealthPlan !== false &&
    input.career.employmentType === 'w2' &&
    input.career.baseSalaryAnnual > 0;

  return {
    healthInsurance: includeHealth ? LIVING_EXPENSE_STUB_2026.healthInsuranceSingleMonthly : 0,
    utilities: roundCents(
      LIVING_EXPENSE_STUB_2026.utilitiesBaseMonthly * housingArrangementFraction(arrangement),
    ),
    groceries: computeGroceriesMonthlyCents({
      cookingSkill: input.cookingSkill,
      deliveryFrequency: input.deliveryFrequency,
    }),
    subscriptions: LIVING_EXPENSE_STUB_2026.subscriptionsStubMonthly,
  };
}

const LIVING_EXPENSE_DESCRIPTIONS: Record<LivingExpenseCategory, string> = {
  healthInsurance: 'Health insurance premium',
  utilities: 'Utilities',
  groceries: 'Groceries',
  subscriptions: 'Subscriptions and phone',
};

export function buildLivingExpenseTransaction(
  monthKey: string,
  category: LivingExpenseCategory,
  amountCents: MoneyCents,
): LedgerTransaction | null {
  if (amountCents <= 0) {
    return null;
  }

  const accountId = LIVING_EXPENSE_ACCOUNT_IDS[category];
  return {
    id: `tx-${monthKey}-living-${category}`,
    description: LIVING_EXPENSE_DESCRIPTIONS[category],
    source: 'expense',
    lines: [
      { accountId, debitCents: amountCents, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: amountCents },
    ],
  };
}

export function buildLivingExpenseTransactions(
  monthKey: string,
  input: LivingExpensesInput,
): LedgerTransaction[] {
  if (input.career.employmentType !== 'w2' || input.career.baseSalaryAnnual <= 0) {
    return [];
  }

  const amounts = computeMonthlyLivingExpenses(input);
  return (Object.keys(amounts) as LivingExpenseCategory[])
    .map((category) => buildLivingExpenseTransaction(monthKey, category, amounts[category]))
    .filter((tx): tx is LedgerTransaction => tx !== null);
}

export const LIVING_EXPENSE_WATERFALL_LABELS: Record<LivingExpenseCategory, string> = {
  healthInsurance: 'Health insurance',
  utilities: 'Utilities',
  groceries: 'Groceries',
  subscriptions: 'Subscriptions',
};
