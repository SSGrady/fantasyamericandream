interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 border-t border-border py-4 first:border-t-0 first:pt-0">
      <span>
        <span className="block font-medium text-ink">{label}</span>
        <span className="mt-1 block text-sm text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent"
      />
    </label>
  );
}
