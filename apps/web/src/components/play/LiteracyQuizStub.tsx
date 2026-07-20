'use client';

import { useState } from 'react';

interface LiteracyQuizStubProps {
  answered: boolean;
  onAnswer: (correct: boolean) => void;
  eventContext?: string;
}

const DEFAULT_OPTIONS = [
  { id: 'savings', label: 'Savings rate (how much you keep each month)' },
  { id: 'returns', label: 'Investment returns (market performance)' },
  { id: 'salary', label: 'Starting salary alone' },
];

const RTO_OPTIONS = [
  { id: 'commute', label: 'Commute time replaces paid work or rest hours' },
  { id: 'salary', label: 'Salary always rises with office days' },
  { id: 'rent', label: 'Rent drops when you commute more' },
];

export function LiteracyQuizStub({ answered, onAnswer, eventContext }: LiteracyQuizStubProps) {
  const isRto = eventContext === 'return_to_office';
  const options = isRto ? RTO_OPTIONS : DEFAULT_OPTIONS;
  const correctId = isRto ? 'commute' : 'savings';

  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(answered);

  const handleSubmit = () => {
    if (!selected) return;
    setRevealed(true);
    onAnswer(selected === correctId);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {isRto ? 'Event quiz · RTO' : 'Literacy quiz'}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-ink">
        {isRto ? 'What does RTO cost besides gas?' : 'The First $100K'}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {isRto
          ? 'Return-to-office mandates often eat weekly capacity through commute and prep time.'
          : 'What matters most for reaching your first $100K of net worth in your twenties?'}
      </p>

      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent/40"
          >
            <input
              type="radio"
              name={`quiz-${eventContext ?? 'default'}`}
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
          {isRto
            ? 'Commute and office prep consume weekly capacity. That trade shows up in side-gig and upskill hours, not just dollars.'
            : 'Savings rate drives the first $100K for most earners. Unlocks Investing I and savings-rate emphasis in analysis.'}
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
