import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Accounts, Debts, LedgerTransaction } from '@fad/shared';
import {
  applyTransactions,
  assertInvariants,
  netWorth,
  validateInvariants,
  validateNetWorthInvariant,
} from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseAccounts = (): Accounts => ({
  checking: { id: 'checking', balance: 5_000_00 },
  hysa: { id: 'hysa', balance: 10_000_00 },
  brokerage: { id: 'brokerage', balance: 0 },
  rothIra: { id: 'roth', balance: 0, taxYearContributions: 0 },
  traditional401k: { id: '401k', balance: 0, taxYearContributions: 0 },
});

const baseDebts = (): Debts => ({
  creditCards: [
    { id: 'cc1', balance: 500_00, limit: 5_000_00, apr: 0.2199, minimumPayment: 25_00 },
  ],
  studentLoans: [{ id: 'sl1', principal: 25_000_00, apr: 0.055, minimumPayment: 280_00 }],
  mortgages: [],
});

describe('invariant 1: balance equation', () => {
  it('net worth equals assets minus liabilities', () => {
    const accounts = baseAccounts();
    const debts = baseDebts();
    expect(validateNetWorthInvariant(accounts, debts)).toBe(true);
    expect(netWorth(accounts, debts)).toBe(15_000_00 - 25_500_00);
  });
});

describe('invariant 2: double-entry', () => {
  it('rejects unbalanced transactions', () => {
    const badTx: LedgerTransaction = {
      id: 'tx-bad',
      description: 'Unbalanced',
      source: 'income',
      lines: [
        { accountId: 'checking', debitCents: 100_00, creditCents: 0 },
        { accountId: 'income:salary', debitCents: 0, creditCents: 50_00 },
      ],
    };

    const violations = validateInvariants(baseAccounts(), baseDebts(), [badTx]);
    expect(violations.some((v) => v.invariant === 2)).toBe(true);
  });

  it('accepts balanced income to checking', () => {
    const tx: LedgerTransaction = {
      id: 'tx-pay',
      description: 'Paycheck',
      source: 'income',
      lines: [
        { accountId: 'checking', debitCents: 100_00, creditCents: 0 },
        { accountId: 'income:salary', debitCents: 0, creditCents: 100_00 },
      ],
    };

    expect(validateInvariants(baseAccounts(), baseDebts(), [tx])).toHaveLength(0);
  });
});

describe('invariant 3: no silent cash creation', () => {
  it('rejects asset debit without allowed source', () => {
    const tx: LedgerTransaction = {
      id: 'tx-magic',
      description: 'Free money',
      source: 'expense',
      lines: [
        { accountId: 'checking', debitCents: 100_00, creditCents: 0 },
        { accountId: 'expense:food', debitCents: 0, creditCents: 100_00 },
      ],
    };

    const violations = validateInvariants(baseAccounts(), baseDebts(), [tx]);
    expect(violations.some((v) => v.invariant === 3)).toBe(true);
  });
});

describe('invariant 4: integer cents', () => {
  it('rejects fractional cents', () => {
    const tx: LedgerTransaction = {
      id: 'tx-frac',
      description: 'Fractional',
      source: 'income',
      lines: [
        { accountId: 'checking', debitCents: 100.5, creditCents: 0 },
        { accountId: 'income:salary', debitCents: 0, creditCents: 100.5 },
      ],
    };

    const violations = validateInvariants(baseAccounts(), baseDebts(), [tx]);
    expect(violations.some((v) => v.invariant === 4)).toBe(true);
  });
});

describe('applyTransactions', () => {
  it('applies golden fixture: checking plus credit card payment', () => {
    const fixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures/checking-cc-month.json'), 'utf8'),
    ) as {
      initial: { accounts: Accounts; debts: Debts };
      transactions: LedgerTransaction[];
      expectedAfterPaycheckAndPayment: {
        accounts: { checking: { balance: number }; hysa: { balance: number } };
        debts: { creditCards: Array<{ id: string; balance: number }> };
        netWorth: number;
      };
    };

    for (const tx of fixture.transactions) {
      assertInvariants(fixture.initial.accounts, fixture.initial.debts, [tx]);
    }

    const result = applyTransactions(
      fixture.initial.accounts,
      fixture.initial.debts,
      fixture.transactions,
    );

    expect(result.accounts.checking.balance).toBe(
      fixture.expectedAfterPaycheckAndPayment.accounts.checking.balance,
    );
    expect(result.accounts.hysa.balance).toBe(
      fixture.expectedAfterPaycheckAndPayment.accounts.hysa.balance,
    );
    expect(result.debts.creditCards[0]?.balance).toBe(0);
    expect(netWorth(result.accounts, result.debts)).toBe(
      fixture.expectedAfterPaycheckAndPayment.netWorth,
    );
    expect(validateInvariants(result.accounts, result.debts)).toHaveLength(0);
  });

  it('sorts transactions by id deterministically', () => {
    const accounts = baseAccounts();
    const debts = baseDebts();

    const txA: LedgerTransaction = {
      id: 'tx-a',
      description: 'A',
      source: 'income',
      lines: [
        { accountId: 'checking', debitCents: 10_00, creditCents: 0 },
        { accountId: 'income:salary', debitCents: 0, creditCents: 10_00 },
      ],
    };

    const txB: LedgerTransaction = {
      id: 'tx-b',
      description: 'B',
      source: 'transfer',
      lines: [
        { accountId: 'checking', debitCents: 0, creditCents: 5_00 },
        { accountId: 'hysa', debitCents: 5_00, creditCents: 0 },
      ],
    };

    const forward = applyTransactions(accounts, debts, [txB, txA]);
    const reverse = applyTransactions(accounts, debts, [txA, txB]);
    expect(forward.accounts.checking.balance).toBe(reverse.accounts.checking.balance);
    expect(forward.accounts.hysa.balance).toBe(reverse.accounts.hysa.balance);
  });
});
