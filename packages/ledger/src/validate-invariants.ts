import type { Accounts, Debts, LedgerLine, LedgerTransaction, MoneyCents } from '@fad/shared';
import { netWorth, validateNetWorthInvariant } from './net-worth.js';

const ASSET_INCREASE_SOURCES = new Set([
  'income',
  'transfer',
  'investment_return',
  'interest_income',
  'borrowing',
]);

export type InvariantViolation = {
  invariant: 1 | 2 | 3 | 4;
  message: string;
};

function isIntegerCents(value: MoneyCents): boolean {
  return Number.isInteger(value);
}

function totalDebits(lines: LedgerLine[]): MoneyCents {
  return lines.reduce((sum, line) => sum + line.debitCents, 0);
}

function totalCredits(lines: LedgerLine[]): MoneyCents {
  return lines.reduce((sum, line) => sum + line.creditCents, 0);
}

function assetDebitCents(lines: LedgerLine[]): MoneyCents {
  const assetIds = new Set(['checking', 'hysa', 'brokerage', 'rothIra', 'traditional401k', 'plan529']);
  return lines
    .filter((line) => assetIds.has(line.accountId))
    .reduce((sum, line) => sum + line.debitCents, 0);
}

function validateTransaction(tx: LedgerTransaction): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  for (const line of tx.lines) {
    if (!isIntegerCents(line.debitCents) || !isIntegerCents(line.creditCents)) {
      violations.push({
        invariant: 4,
        message: `Transaction ${tx.id} uses non-integer cents`,
      });
      break;
    }
    if (line.debitCents > 0 && line.creditCents > 0) {
      violations.push({
        invariant: 4,
        message: `Transaction ${tx.id} line ${line.accountId} has both debit and credit`,
      });
    }
    if (line.debitCents < 0 || line.creditCents < 0) {
      violations.push({
        invariant: 4,
        message: `Transaction ${tx.id} line ${line.accountId} has negative debit/credit`,
      });
    }
  }

  if (totalDebits(tx.lines) !== totalCredits(tx.lines)) {
    violations.push({
      invariant: 2,
      message: `Transaction ${tx.id} is not balanced: debits ${totalDebits(tx.lines)} != credits ${totalCredits(tx.lines)}`,
    });
  }

  if (assetDebitCents(tx.lines) > 0 && !ASSET_INCREASE_SOURCES.has(tx.source)) {
    violations.push({
      invariant: 3,
      message: `Transaction ${tx.id} increases assets without allowed source (${tx.source})`,
    });
  }

  return violations;
}

export function validateInvariants(
  accounts: Accounts,
  debts: Debts,
  transactions: LedgerTransaction[] = [],
): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  if (!validateNetWorthInvariant(accounts, debts)) {
    violations.push({
      invariant: 1,
      message: 'Net worth does not equal assets minus liabilities',
    });
  }

  for (const tx of transactions) {
    violations.push(...validateTransaction(tx));
  }

  return violations;
}

export function assertInvariants(
  accounts: Accounts,
  debts: Debts,
  transactions: LedgerTransaction[] = [],
): void {
  const violations = validateInvariants(accounts, debts, transactions);
  if (violations.length > 0) {
    throw new Error(violations.map((v) => `[${v.invariant}] ${v.message}`).join('; '));
  }
}

export { netWorth };
