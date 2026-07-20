'use client';

import { useState, type ReactNode } from 'react';

interface ShowTheMathProps {
  summary?: string;
  children?: ReactNode;
}

export function ShowTheMath({ summary, children }: ShowTheMathProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-sm font-medium text-accent hover:text-accent/80"
        aria-expanded={open}
      >
        {open ? 'Hide the math' : 'Show the math'}
      </button>
      {open ? (
        <div className="mt-3 space-y-2">
          {summary ? <p className="text-xs text-muted">{summary}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
