import type { Accounts, Debts } from '@fad/shared';

export function cloneAccounts(accounts: Accounts): Accounts {
  return {
    checking: { ...accounts.checking },
    hysa: { ...accounts.hysa },
    brokerage: { ...accounts.brokerage },
    rothIra: { ...accounts.rothIra },
    traditional401k: { ...accounts.traditional401k },
  };
}

export function cloneDebts(debts: Debts): Debts {
  return {
    creditCards: debts.creditCards.map((c) => ({ ...c })),
    studentLoans: debts.studentLoans.map((l) => ({ ...l })),
  };
}
