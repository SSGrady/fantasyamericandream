import type {
  Accounts,
  CareerState,
  Debts,
  HouseholdState,
  LedgerTransaction,
  LocationState,
  MoneyCents,
  PlayerState,
  TermDebt,
  V1HousingArrangement,
} from '@fad/shared';
import { childcareMonthlyCents, V1_MODULE_IDS } from '@fad/shared';
import { applyTransactions, type ApplyTransactionsResult } from './apply-transaction.js';
import {
  buildCreditCardAutopayTransaction,
  buildLivingExpenseTransactions,
} from './living-expenses.js';
import { buildInsurancePremiumTransactions } from './insurance-premiums.js';
import { buildMortgagePitiTransaction } from './mortgage.js';
import { buildPayrollFromCareer } from './payroll.js';

export interface MonthlyTickInput {
  monthKey: string;
  accounts: Accounts;
  debts: Debts;
  career: Pick<CareerState, 'employmentType' | 'baseSalaryAnnual'>;
  location: Pick<
    LocationState,
    'rentPaymentMonthly' | 'housingArrangement' | 'housingMode' | 'homeValueCents'
  >;
  household?: Pick<HouseholdState, 'partner' | 'dependentsCount'>;
  player?: Pick<PlayerState, 'habits' | 'includeEmployerHealthPlan'> & { ageYears?: number };
  deferral401kRate?: number;
  enabledModules?: string[];
  /** Post-payday savings and debt commands from action scheduler. */
  savingsTransfers?: {
    hysaCents?: number;
    brokerageCents?: number;
    rothIraCents?: number;
    studentLoanExtraCents?: number;
    creditCardExtraCents?: number;
  };
}

export interface MonthlyTickResult extends ApplyTransactionsResult {
  transactions: LedgerTransaction[];
}

function roundCents(value: number): MoneyCents {
  return Math.round(value);
}

export function monthlyInterestCents(balance: MoneyCents, apr: number): MoneyCents {
  if (balance <= 0) {
    return 0;
  }
  return roundCents((balance * apr) / 12);
}

export function buildCreditCardInterestTransactions(
  monthKey: string,
  debts: Debts,
): LedgerTransaction[] {
  const transactions: LedgerTransaction[] = [];

  for (const card of debts.creditCards) {
    const interest = monthlyInterestCents(card.balance, card.apr);
    if (interest <= 0) {
      continue;
    }

    transactions.push({
      id: `tx-${monthKey}-cc-interest-${card.id}`,
      description: `Credit card interest (${card.id})`,
      source: 'interest_expense',
      lines: [
        { accountId: 'expense:creditCardInterest', debitCents: interest, creditCents: 0 },
        { accountId: `creditCard:${card.id}`, debitCents: 0, creditCents: interest },
      ],
    });
  }

  return transactions;
}

export function buildRentTransaction(
  monthKey: string,
  rentPaymentMonthly: MoneyCents,
): LedgerTransaction {
  return {
    id: `tx-${monthKey}-rent`,
    description: 'Monthly rent',
    source: 'expense',
    lines: [
      { accountId: 'expense:rent', debitCents: rentPaymentMonthly, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: rentPaymentMonthly },
    ],
  };
}

export function buildCreditCardAutopayTransactions(
  monthKey: string,
  accounts: Accounts,
  debts: Debts,
  pendingCharges: LedgerTransaction[],
): LedgerTransaction[] {
  const applied = applyTransactions(accounts, debts, pendingCharges);
  const transactions: LedgerTransaction[] = [];

  for (const card of applied.debts.creditCards) {
    const tx = buildCreditCardAutopayTransaction(monthKey, card.id, card.balance);
    if (tx) {
      transactions.push(tx);
    }
  }

  return transactions;
}

export function buildChildcareTransaction(
  monthKey: string,
  dependentsCount: number,
): LedgerTransaction | null {
  const amount = childcareMonthlyCents(dependentsCount);
  if (amount <= 0) {
    return null;
  }

  return {
    id: `tx-${monthKey}-childcare`,
    description: `Childcare (${dependentsCount} dependent${dependentsCount === 1 ? '' : 's'})`,
    source: 'expense',
    lines: [
      { accountId: 'expense:childcare', debitCents: amount, creditCents: 0 },
      { accountId: 'checking', debitCents: 0, creditCents: amount },
    ],
  };
}

export interface StudentLoanPaymentSplit {
  interestCents: MoneyCents;
  principalCents: MoneyCents;
  totalCents: MoneyCents;
}

export function splitStudentLoanPayment(loan: TermDebt): StudentLoanPaymentSplit {
  const interestDue = monthlyInterestCents(loan.principal, loan.apr);
  const interestCents = Math.min(loan.minimumPayment, interestDue);
  const principalCents = Math.min(loan.minimumPayment - interestCents, loan.principal);
  return {
    interestCents,
    principalCents,
    totalCents: interestCents + principalCents,
  };
}

export function buildStudentLoanPaymentTransaction(
  monthKey: string,
  loan: TermDebt,
): LedgerTransaction | null {
  const split = splitStudentLoanPayment(loan);
  if (split.totalCents <= 0 || loan.principal <= 0) {
    return null;
  }

  const lines: LedgerTransaction['lines'] = [
    { accountId: 'checking', debitCents: 0, creditCents: split.totalCents },
  ];

  if (split.interestCents > 0) {
    lines.push({
      accountId: 'expense:studentLoanInterest',
      debitCents: split.interestCents,
      creditCents: 0,
    });
  }

  if (split.principalCents > 0) {
    lines.push({
      accountId: `studentLoan:${loan.id}`,
      debitCents: split.principalCents,
      creditCents: 0,
    });
  }

  return {
    id: `tx-${monthKey}-sl-payment-${loan.id}`,
    description: `Student loan minimum payment (${loan.id})`,
    source: 'debt_payment',
    lines,
  };
}

export function buildStudentLoanPaymentTransactions(
  monthKey: string,
  debts: Debts,
): LedgerTransaction[] {
  return debts.studentLoans
    .map((loan) => buildStudentLoanPaymentTransaction(monthKey, loan))
    .filter((tx): tx is LedgerTransaction => tx !== null);
}

export function buildMonthlyTransactions(input: MonthlyTickInput): LedgerTransaction[] {
  const transactions: LedgerTransaction[] = [];
  const primaryCard = input.debts.creditCards[0];

  if (input.career.employmentType === 'w2' && input.career.baseSalaryAnnual > 0) {
    transactions.push(
      buildPayrollFromCareer(
        input.monthKey,
        input.career.baseSalaryAnnual,
        input.accounts,
        input.deferral401kRate ?? 0.06,
      ),
    );
  }

  const partner = input.household?.partner;
  if (partner?.employmentType === 'w2' && partner.baseSalaryAnnual > 0) {
    const partnerPayroll = buildPayrollFromCareer(
      `${input.monthKey}-partner`,
      partner.baseSalaryAnnual,
      input.accounts,
      partner.deferral401kRate,
    );
    transactions.push({
      ...partnerPayroll,
      id: `tx-${input.monthKey}-payroll-partner`,
      description: 'Partner monthly W2 payroll',
    });
  }

  const ccInterest = buildCreditCardInterestTransactions(input.monthKey, input.debts);
  transactions.push(...ccInterest);

  const livingExpenseCharges = buildLivingExpenseTransactions(input.monthKey, {
    career: input.career,
    housingArrangement: input.location.housingArrangement as V1HousingArrangement | undefined,
    cookingSkill: input.player?.habits.cookingSkill,
    deliveryFrequency: input.player?.habits.deliveryFrequency,
    includeEmployerHealthPlan: input.player?.includeEmployerHealthPlan,
    creditCardId: primaryCard?.id,
  });
  transactions.push(...livingExpenseCharges);

  if (primaryCard) {
    const ccBalanceTransactions = [...ccInterest, ...livingExpenseCharges];
    transactions.push(
      ...buildCreditCardAutopayTransactions(
        input.monthKey,
        input.accounts,
        input.debts,
        ccBalanceTransactions,
      ),
    );
  }

  if (input.location.housingMode === 'own') {
    const mortgage = input.debts.mortgages?.[0];
    if (mortgage && mortgage.monthlyPiti > 0) {
      transactions.push(buildMortgagePitiTransaction(input.monthKey, mortgage.monthlyPiti));
    }
  } else if (input.location.rentPaymentMonthly > 0) {
    transactions.push(buildRentTransaction(input.monthKey, input.location.rentPaymentMonthly));
  }

  const childcare = buildChildcareTransaction(
    input.monthKey,
    input.household?.dependentsCount ?? 0,
  );
  if (childcare) {
    transactions.push(childcare);
  }

  const enabledModules = input.enabledModules ?? [];
  const termLifeEnabled = enabledModules.includes(V1_MODULE_IDS.insuranceTermLife);
  const disabilityEnabled = enabledModules.includes(V1_MODULE_IDS.insuranceDisability);
  if (termLifeEnabled || disabilityEnabled) {
    transactions.push(
      ...buildInsurancePremiumTransactions({
        monthKey: input.monthKey,
        ageYears: input.player?.ageYears ?? 25,
        career: input.career,
        termLifeEnabled,
        disabilityEnabled,
      }),
    );
  }

  transactions.push(...buildStudentLoanPaymentTransactions(input.monthKey, input.debts));

  const transfers = input.savingsTransfers;
  if (transfers?.hysaCents && transfers.hysaCents > 0) {
    transactions.push({
      id: `tx-${input.monthKey}-transfer-hysa`,
      description: 'HYSA auto-transfer',
      source: 'transfer',
      lines: [
        { accountId: 'hysa', debitCents: transfers.hysaCents, creditCents: 0 },
        { accountId: 'checking', debitCents: 0, creditCents: transfers.hysaCents },
      ],
    });
  }
  if (transfers?.brokerageCents && transfers.brokerageCents > 0) {
    transactions.push({
      id: `tx-${input.monthKey}-transfer-brokerage`,
      description: 'Brokerage auto-transfer',
      source: 'transfer',
      lines: [
        { accountId: 'brokerage', debitCents: transfers.brokerageCents, creditCents: 0 },
        { accountId: 'checking', debitCents: 0, creditCents: transfers.brokerageCents },
      ],
    });
  }
  if (transfers?.rothIraCents && transfers.rothIraCents > 0) {
    transactions.push({
      id: `tx-${input.monthKey}-transfer-roth`,
      description: 'Roth IRA contribution transfer',
      source: 'transfer',
      lines: [
        { accountId: 'rothIra', debitCents: transfers.rothIraCents, creditCents: 0 },
        { accountId: 'checking', debitCents: 0, creditCents: transfers.rothIraCents },
      ],
    });
  }
  if (transfers?.creditCardExtraCents && transfers.creditCardExtraCents > 0 && primaryCard) {
    transactions.push({
      id: `tx-${input.monthKey}-cc-extra-${primaryCard.id}`,
      description: 'Extra credit card paydown',
      source: 'debt_payment',
      lines: [
        { accountId: 'checking', debitCents: 0, creditCents: transfers.creditCardExtraCents },
        { accountId: `creditCard:${primaryCard.id}`, debitCents: transfers.creditCardExtraCents, creditCents: 0 },
      ],
    });
  }

  return transactions.sort((a, b) => a.id.localeCompare(b.id));
}

export function applyMonthlyTick(input: MonthlyTickInput): MonthlyTickResult {
  const transactions = buildMonthlyTransactions(input);
  const applied = applyTransactions(input.accounts, input.debts, transactions);

  return {
    ...applied,
    transactions,
  };
}
