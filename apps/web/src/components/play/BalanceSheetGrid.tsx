'use client';

import type { Accounts, Debts } from '@fad/shared';
import { formatMoney } from '../../lib/format-money';

interface BalanceSheetGridProps {
  accounts: Accounts;
  debts: Debts;
}

export function BalanceSheetGrid({ accounts, debts }: BalanceSheetGridProps) {
  const creditCardBalance = debts.creditCards.reduce((sum, card) => sum + card.balance, 0);
  const studentLoanBalance = debts.studentLoans.reduce((sum, loan) => sum + loan.principal, 0);

  const rows = [
    { label: 'Checking', amount: accounts.checking.balance, type: 'asset' as const },
    { label: 'High-yield savings', amount: accounts.hysa.balance, type: 'asset' as const },
    { label: 'Brokerage', amount: accounts.brokerage.balance, type: 'asset' as const },
    { label: 'Roth IRA', amount: accounts.rothIra.balance, type: 'asset' as const },
    { label: 'Traditional 401(k)', amount: accounts.traditional401k.balance, type: 'asset' as const },
    { label: 'Credit cards', amount: creditCardBalance, type: 'liability' as const },
    { label: 'Student loans', amount: studentLoanBalance, type: 'liability' as const },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
        >
          <span className="text-sm text-muted">{row.label}</span>
          <span
            className={`text-sm font-semibold ${row.type === 'liability' ? 'text-red-700' : 'text-ink'}`}
          >
            {row.type === 'liability' ? `−${formatMoney(row.amount)}` : formatMoney(row.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
