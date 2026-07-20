import type { MoneyCents } from './game-state.js';

/** Why money moved. Used for invariant 3 (no silent cash creation). */
export type TransactionSource =
  | 'income'
  | 'transfer'
  | 'investment_return'
  | 'interest_income'
  | 'expense'
  | 'interest_expense'
  | 'debt_payment'
  | 'borrowing';

export type AssetAccountId =
  | 'checking'
  | 'hysa'
  | 'brokerage'
  | 'rothIra'
  | 'traditional401k'
  | 'plan529';

export type LiabilityAccountId =
  | `creditCard:${string}`
  | `studentLoan:${string}`
  | `mortgage:${string}`;

export type NominalAccountId = `income:${string}` | `expense:${string}`;

export type LedgerAccountId = AssetAccountId | LiabilityAccountId | NominalAccountId;

export interface LedgerLine {
  accountId: LedgerAccountId;
  debitCents: MoneyCents;
  creditCents: MoneyCents;
}

export interface LedgerTransaction {
  id: string;
  description: string;
  source: TransactionSource;
  lines: LedgerLine[];
}

export interface LedgerState {
  accounts: import('./game-state.js').Accounts;
  debts: import('./game-state.js').Debts;
}
