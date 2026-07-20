'use client';

import { useState } from 'react';
import type { NetWorthWaterfallLine } from '@fad/shared';
import { WaterfallList } from './WaterfallList';

interface ShowTheMathProps {
  lines: NetWorthWaterfallLine[];
  summary?: string;
}

export function ShowTheMath({ lines, summary }: ShowTheMathProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t border-border pt-3">
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
          <WaterfallList lines={lines} />
        </div>
      ) : null}
    </div>
  );
}
