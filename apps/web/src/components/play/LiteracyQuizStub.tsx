'use client';

import { useState } from 'react';

interface LiteracyQuizStubProps {
  answered: boolean;
  onAnswer: () => void;
}

const OPTIONS = [
  { id: 'savings', label: 'Savings rate (how much you keep each month)' },
  { id: 'returns', label: 'Investment returns (market performance)' },
  { id: 'salary', label: 'Starting salary alone' },
];

export function LiteracyQuizStub({ answered, onAnswer }: LiteracyQuizStubProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(answered);

  const handleSubmit = () => {
    if (!selected) return;
    setRevealed(true);
    onAnswer();
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Literacy quiz stub</p>
      <h3 className="mt-1 text-sm font-semibold text-ink">The First $100K</h3>
      <p className="mt-2 text-sm text-muted">
        What matters most for reaching your first $100K of net worth in your twenties?
      </p>

      <div className="mt-3 space-y-2">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent/40"
          >
            <input
              type="radio"
              name="first-100k-quiz"
              value={option.id}
              checked={selected === option.id}
              disabled={revealed}
              onChange={() => setSelected(option.id)}
              className="mt-0.5"
            />
            <span className="text-ink">{option.label}</span>
          </label>
        ))}
      </div>

      {revealed ? (
        <p className="mt-3 rounded-md bg-surface px-3 py-2 text-sm text-muted">
          Savings rate drives the first $100K for most earners. Unlocks savings-rate emphasis in
          projections (no luck modifiers).
        </p>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-3 inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-accent/40 disabled:opacity-50"
        >
          Check answer
        </button>
      )}
    </div>
  );
}
