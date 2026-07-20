import type {
  Accounts,
  AssetAccountId,
  Debts,
  LedgerAccountId,
  LedgerLine,
  LedgerTransaction,
  MoneyCents,
} from '@fad/shared';
import { cloneAccounts, cloneDebts } from './clone-state.js';

const ASSET_IDS: AssetAccountId[] = [
  'checking',
  'hysa',
  'brokerage',
  'rothIra',
  'traditional401k',
];

function isAssetAccountId(id: LedgerAccountId): id is AssetAccountId {
  return (ASSET_IDS as string[]).includes(id);
}

function applyAssetDelta(accounts: Accounts, id: AssetAccountId, delta: MoneyCents): void {
  const bucket = accounts[id];
  const next = bucket.balance + delta;
  if (next < 0) {
    throw new Error(`Insufficient balance in ${id}: ${bucket.balance} + ${delta}`);
  }
  bucket.balance = next;
}

function applyLiabilityDelta(debts: Debts, accountId: LedgerAccountId, delta: MoneyCents): void {
  if (accountId.startsWith('creditCard:')) {
    const cardId = accountId.slice('creditCard:'.length);
    const card = debts.creditCards.find((c) => c.id === cardId);
    if (!card) {
      throw new Error(`Unknown credit card: ${cardId}`);
    }
    const next = card.balance + delta;
    if (next < 0) {
      throw new Error(`Credit card ${cardId} balance cannot go negative`);
    }
    card.balance = next;
    return;
  }

  if (accountId.startsWith('studentLoan:')) {
    const loanId = accountId.slice('studentLoan:'.length);
    const loan = debts.studentLoans.find((l) => l.id === loanId);
    if (!loan) {
      throw new Error(`Unknown student loan: ${loanId}`);
    }
    const next = loan.principal + delta;
    if (next < 0) {
      throw new Error(`Student loan ${loanId} principal cannot go negative`);
    }
    loan.principal = next;
  }
}

function lineDeltaAsset(line: LedgerLine): MoneyCents {
  return line.debitCents - line.creditCents;
}

function lineDeltaLiability(line: LedgerLine): MoneyCents {
  return line.creditCents - line.debitCents;
}

function applyLine(accounts: Accounts, debts: Debts, line: LedgerLine): void {
  const { accountId } = line;

  if (accountId.startsWith('income:') || accountId.startsWith('expense:')) {
    return;
  }

  if (isAssetAccountId(accountId)) {
    applyAssetDelta(accounts, accountId, lineDeltaAsset(line));
    return;
  }

  applyLiabilityDelta(debts, accountId, lineDeltaLiability(line));
}

export function applySingleTransaction(
  accounts: Accounts,
  debts: Debts,
  transaction: LedgerTransaction,
): void {
  for (const line of transaction.lines) {
    applyLine(accounts, debts, line);
  }
}

export interface ApplyTransactionsResult {
  accounts: Accounts;
  debts: Debts;
  appliedIds: string[];
}

export function applyTransactions(
  accounts: Accounts,
  debts: Debts,
  transactions: LedgerTransaction[],
): ApplyTransactionsResult {
  const nextAccounts = cloneAccounts(accounts);
  const nextDebts = cloneDebts(debts);
  const sorted = [...transactions].sort((a, b) => a.id.localeCompare(b.id));
  const appliedIds: string[] = [];

  for (const tx of sorted) {
    applySingleTransaction(nextAccounts, nextDebts, tx);
    appliedIds.push(tx.id);
  }

  return { accounts: nextAccounts, debts: nextDebts, appliedIds };
}
