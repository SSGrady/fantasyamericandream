import type { Accounts, Debts } from '@fad/shared';

export function cloneAccounts(accounts: Accounts): Accounts {
  const cloned: Accounts = {
    checking: { ...accounts.checking },
    hysa: { ...accounts.hysa },
    brokerage: { ...accounts.brokerage },
    rothIra: { ...accounts.rothIra },
    traditional401k: { ...accounts.traditional401k },
  };
  if (accounts.plan529) {
    cloned.plan529 = { ...accounts.plan529 };
  }
  return cloned;
}

export function cloneDebts(debts: Debts): Debts {
  return {
    creditCards: debts.creditCards.map((c) => ({ ...c })),
    studentLoans: debts.studentLoans.map((l) => ({ ...l })),
    mortgages: (debts.mortgages ?? []).map((m) => ({ ...m })),
  };
}
