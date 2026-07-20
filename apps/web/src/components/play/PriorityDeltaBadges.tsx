'use client';

import type { PriorityDelta } from '../../lib/priority-deltas';
import { formatPriorityDelta } from '../../lib/priority-deltas';

interface PriorityDeltaBadgesProps {
  deltas: PriorityDelta[];
}

export function PriorityDeltaBadges({ deltas }: PriorityDeltaBadgesProps) {
  if (deltas.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {deltas.map((delta) => (
        <span
          key={delta.priority}
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            delta.delta > 0
              ? 'bg-positive/10 text-positive'
              : delta.delta < 0
                ? 'bg-negative/10 text-negative'
                : 'bg-surface text-muted'
          }`}
        >
          {formatPriorityDelta(delta)}
        </span>
      ))}
    </div>
  );
}
