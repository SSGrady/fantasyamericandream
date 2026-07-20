import type { Accounts, Debts, MoneyCents } from '@fad/shared';

/** Sum liquid and investment asset balances (V0 subset). */
export function totalAssets(accounts: Accounts): MoneyCents {
  const plan529Balance = accounts.plan529?.balance ?? 0;
  return (
    accounts.checking.balance +
    accounts.hysa.balance +
    accounts.brokerage.balance +
    accounts.rothIra.balance +
    accounts.traditional401k.balance +
    plan529Balance
  );
}

/** Sum outstanding liability balances (V0 subset). */
export function totalLiabilities(debts: Debts): MoneyCents {
  const cc = debts.creditCards.reduce((sum, c) => sum + c.balance, 0);
  const sl = debts.studentLoans.reduce((sum, l) => sum + l.principal, 0);
  const mtg = (debts.mortgages ?? []).reduce((sum, m) => sum + m.principal, 0);
  return cc + sl + mtg;
}

export function netWorth(accounts: Accounts, debts: Debts): MoneyCents {
  return totalAssets(accounts) - totalLiabilities(debts);
}

export function validateNetWorthInvariant(accounts: Accounts, debts: Debts): boolean {
  return netWorth(accounts, debts) === totalAssets(accounts) - totalLiabilities(debts);
}
