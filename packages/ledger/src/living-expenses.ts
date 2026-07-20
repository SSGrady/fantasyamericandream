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
  /** Target monthly card spend including groceries (Payday Playbook). */
  creditCardPlaybookMonthly: 1_039_00,
} as const;

export const LIVING_EXPENSE_ACCOUNT_IDS = {
  healthInsurance: 'expense:healthInsurance',
  utilities: 'expense:utilities',
  groceries: 'expense:groceries',
  subscriptions: 'expense:subscriptions',
  discretionary: 'expense:discretionary',
} as const;

export type LivingExpenseCategory = keyof typeof LIVING_EXPENSE_ACCOUNT_IDS;

/** Categories charged to credit card then paid in full from checking. */
export type CreditCardExpenseCategory = 'groceries' | 'subscriptions' | 'discretionary';

export interface LivingExpensesInput {
  career: Pick<CareerState, 'employmentType' | 'baseSalaryAnnual'>;
  housingArrangement?: V1HousingArrangement;
  cookingSkill?: V1CookingSkill;
  deliveryFrequency?: V1DeliveryFrequency;
  includeEmployerHealthPlan?: boolean;
  creditCardId?: string;
}

export interface MonthlyLivingExpenseAmounts {
  healthInsurance: MoneyCents;
  utilities: MoneyCents;
  groceries: MoneyCents;
  subscriptions: MoneyCents;
  discretionary: MoneyCents;
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

  const groceries = computeGroceriesMonthlyCents({
    cookingSkill: input.cookingSkill,
    deliveryFrequency: input.deliveryFrequency,
  });
  const subscriptions = LIVING_EXPENSE_STUB_2026.subscriptionsStubMonthly;
  const discretionary = Math.max(
    0,
    LIVING_EXPENSE_STUB_2026.creditCardPlaybookMonthly - groceries - subscriptions,
  );

  return {
    healthInsurance: includeHealth ? LIVING_EXPENSE_STUB_2026.healthInsuranceSingleMonthly : 0,
    utilities: roundCents(
      LIVING_EXPENSE_STUB_2026.utilitiesBaseMonthly * housingArrangementFraction(arrangement),
    ),
    groceries,
    subscriptions,
    discretionary,
  };
}

const LIVING_EXPENSE_DESCRIPTIONS: Record<LivingExpenseCategory, string> = {
  healthInsurance: 'Health insurance premium',
  utilities: 'Utilities',
  groceries: 'Groceries',
  subscriptions: 'Subscriptions and phone',
  discretionary: 'Discretionary card spend',
};

const CHECKING_CATEGORIES: LivingExpenseCategory[] = ['healthInsurance', 'utilities'];
const CREDIT_CARD_CATEGORIES: CreditCardExpenseCategory[] = [
  'groceries',
  'subscriptions',
  'discretionary',
];

export function buildLivingExpenseTransaction(
  monthKey: string,
  category: LivingExpenseCategory,
  amountCents: MoneyCents,
  target: 'checking' | `creditCard:${string}`,
): LedgerTransaction | null {
  if (amountCents <= 0) {
    return null;
  }

  const accountId = LIVING_EXPENSE_ACCOUNT_IDS[category];
  const liabilityLine =
    target === 'checking'
      ? { accountId: 'checking' as const, debitCents: 0, creditCents: amountCents }
      : { accountId: target, debitCents: 0, creditCents: amountCents };

  return {
    id: `tx-${monthKey}-living-${category}`,
    description: LIVING_EXPENSE_DESCRIPTIONS[category],
    source: 'expense',
    lines: [
      { accountId, debitCents: amountCents, creditCents: 0 },
      liabilityLine,
    ],
  };
}

export function buildCreditCardAutopayTransaction(
  monthKey: string,
  cardId: string,
  balanceCents: MoneyCents,
): LedgerTransaction | null {
  if (balanceCents <= 0) {
    return null;
  }

  return {
    id: `tx-${monthKey}-zz-cc-autopay-${cardId}`,
    description: 'Pay credit card statement in full',
    source: 'transfer',
    lines: [
      { accountId: `creditCard:${cardId}`, debitCents: balanceCents, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: balanceCents },
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
  const transactions: LedgerTransaction[] = [];

  for (const category of CHECKING_CATEGORIES) {
    const tx = buildLivingExpenseTransaction(
      monthKey,
      category,
      amounts[category],
      'checking',
    );
    if (tx) {
      transactions.push(tx);
    }
  }

  if (input.creditCardId) {
    for (const category of CREDIT_CARD_CATEGORIES) {
      const tx = buildLivingExpenseTransaction(
        monthKey,
        category,
        amounts[category],
        `creditCard:${input.creditCardId}`,
      );
      if (tx) {
        transactions.push(tx);
      }
    }
  }

  return transactions;
}

export const LIVING_EXPENSE_WATERFALL_LABELS: Record<LivingExpenseCategory, string> = {
  healthInsurance: 'Health insurance',
  utilities: 'Utilities',
  groceries: 'Groceries',
  subscriptions: 'Subscriptions',
  discretionary: 'Discretionary spend',
};
