import { centsToDollars, dollarsToCents, type V1BalanceSheetDraft } from '@fad/shared';

interface BalanceField {
  key: keyof V1BalanceSheetDraft;
  label: string;
  hint: string;
}

const BALANCE_FIELDS: readonly BalanceField[] = [
  { key: 'checking', label: 'Checking', hint: 'Everyday cash buffer' },
  { key: 'hysa', label: 'High-yield savings', hint: 'Emergency fund target' },
  { key: 'rothIra', label: 'Roth IRA', hint: 'Post-tax retirement savings' },
  { key: 'traditional401k', label: '401(k)', hint: 'Employer retirement balance' },
  { key: 'studentLoan', label: 'Student loans', hint: 'Outstanding education debt' },
  { key: 'creditCard', label: 'Credit cards', hint: 'Revolving balance owed' },
] as const;

interface BalanceSheetFormProps {
  value: V1BalanceSheetDraft;
  onChange: (value: V1BalanceSheetDraft) => void;
}

export function BalanceSheetForm({ value, onChange }: BalanceSheetFormProps) {
  const updateField = (key: keyof V1BalanceSheetDraft, dollars: number) => {
    onChange({ ...value, [key]: dollarsToCents(dollars) });
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl text-ink">Starting balance sheet</h2>
      <p className="mt-1 text-sm text-muted">
        Enter starting balances in dollars. Debts are positive amounts owed.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BALANCE_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="block text-sm font-medium text-ink">{field.label}</span>
            <span className="block text-xs text-muted">{field.hint}</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                $
              </span>
              <input
                type="number"
                min={0}
                step={100}
                value={centsToDollars(value[field.key])}
                onChange={(event) => updateField(field.key, Number(event.target.value))}
                className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-7 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
