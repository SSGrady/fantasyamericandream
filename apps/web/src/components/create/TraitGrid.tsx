import type { TraitOption } from '@fad/shared';

interface TraitGridProps<T extends string | number> {
  label: string;
  description?: string;
  options: readonly TraitOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export function TraitGrid<T extends string | number>({
  label,
  description,
  options,
  value,
  onChange,
  columns = 2,
}: TraitGridProps<T>) {
  const gridCols =
    columns === 4 ? 'sm:grid-cols-4' : columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl text-ink">{label}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className={`mt-4 grid grid-cols-1 gap-3 ${gridCols}`}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'rounded-lg border p-4 text-left transition',
                selected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent'
                  : 'border-border bg-card hover:border-accent/40 hover:ring-1 hover:ring-accent/20',
              ].join(' ')}
            >
              <span
                className={[
                  'block font-medium',
                  selected ? 'text-accent' : 'text-ink',
                ].join(' ')}
              >
                {option.label}
              </span>
              <span className="mt-1 block text-sm leading-snug text-muted">{option.modifier}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
