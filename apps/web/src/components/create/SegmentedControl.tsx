interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  modifier?: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: SegmentedControlProps<T>) {
  const gridCols = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 gap-2 ${gridCols}`}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'rounded-md border px-3 py-2 text-left text-sm transition',
              selected
                ? 'border-accent bg-accent/5 font-medium text-accent ring-2 ring-accent'
                : 'border-border bg-card text-ink hover:border-accent/40',
            ].join(' ')}
          >
            <span className="block">{option.label}</span>
            {option.modifier ? (
              <span className="mt-0.5 block text-xs leading-snug text-muted">{option.modifier}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
