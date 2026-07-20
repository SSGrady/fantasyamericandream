'use client';

import type { ChapterInterrupt } from '@fad/domain';
import { interruptMonthIndex } from '@fad/domain';
import { useEffect, useMemo, useState } from 'react';

export interface MonthOutcome {
  glyph: 'up' | 'down' | 'flat' | 'pending';
}

interface LiveMonthRailProps {
  months: string[];
  activeIndex: number;
  completedOutcomes?: MonthOutcome[];
  interrupt?: ChapterInterrupt | null;
  interruptPending?: boolean;
  onInterruptResolve?: (choiceId: string) => void;
  paused?: boolean;
}

function OutcomeGlyph({ glyph }: { glyph: MonthOutcome['glyph'] }) {
  if (glyph === 'up') return <span aria-hidden className="ml-1 text-positive">↑</span>;
  if (glyph === 'down') return <span aria-hidden className="ml-1 text-negative">↓</span>;
  if (glyph === 'flat') return <span aria-hidden className="ml-1 text-muted">→</span>;
  return null;
}

export function LiveMonthRail({
  months,
  activeIndex,
  completedOutcomes,
  interrupt,
  interruptPending,
  onInterruptResolve,
  paused,
}: LiveMonthRailProps) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const [displayIndex, setDisplayIndex] = useState(activeIndex);

  useEffect(() => {
    if (prefersReducedMotion || paused) {
      setDisplayIndex(activeIndex);
      return;
    }
    if (displayIndex >= activeIndex) return;
    const timer = window.setTimeout(() => setDisplayIndex((current) => current + 1), 420);
    return () => window.clearTimeout(timer);
  }, [activeIndex, displayIndex, prefersReducedMotion, paused]);

  const interruptAt = interrupt ? interruptMonthIndex(interrupt) : -1;

  return (
    <div className="relative space-y-3">
      <ol className="flex flex-wrap gap-2" aria-label="Chapter month timeline">
        {months.map((month, index) => {
          const completed = index < displayIndex;
          const active = index === displayIndex;
          const outcome = completedOutcomes?.[index];
          return (
            <li
              key={month}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                completed
                  ? 'bg-positive/15 text-positive ring-1 ring-positive/30'
                  : active
                    ? 'bg-accent text-white shadow-sm'
                    : 'border border-border bg-card text-muted'
              } ${!prefersReducedMotion && active ? 'month-rail-active' : ''}`}
            >
              {month}
              {completed && outcome ? <OutcomeGlyph glyph={outcome.glyph} /> : null}
            </li>
          );
        })}
      </ol>

      {interrupt && interruptPending && interruptAt >= 0 ? (
        <div
          className="card-interrupt rounded-lg border border-warning/40 bg-warning/5 p-4 shadow-sm"
          role="dialog"
          aria-label="Chapter interrupt"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-warning">
            {months[interruptAt]} interrupt
          </p>
          <h3 className="mt-1 font-serif text-lg text-ink">{interrupt.title}</h3>
          <p className="mt-2 text-sm text-muted">{interrupt.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {interrupt.type === 'return_to_office' ? (
              <>
                <button
                  type="button"
                  onClick={() => onInterruptResolve?.('accept-rto')}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
                >
                  Accept RTO (-4h/wk)
                </button>
                <button
                  type="button"
                  onClick={() => onInterruptResolve?.('negotiate-hybrid')}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
                >
                  Negotiate hybrid (-2h/wk)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onInterruptResolve?.('acknowledge')}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
              >
                Acknowledge and continue
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
