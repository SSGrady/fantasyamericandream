'use client';

import type { ChapterStage } from '@fad/domain';

const STAGES: { id: ChapterStage; label: string }[] = [
  { id: 'openingBriefing', label: 'Briefing' },
  { id: 'planning', label: 'Plan' },
  { id: 'simulating', label: 'Live' },
  { id: 'chapterClose', label: 'Close' },
];

interface StageIndicatorProps {
  active: ChapterStage;
  lockedAfter?: ChapterStage;
}

export function StageIndicator({ active, lockedAfter }: StageIndicatorProps) {
  const activeIndex = STAGES.findIndex((stage) => stage.id === active);
  const lockIndex = lockedAfter ? STAGES.findIndex((stage) => stage.id === lockedAfter) : -1;

  return (
    <nav aria-label="Chapter progress" className="flex items-center gap-2">
      {STAGES.map((stage, index) => {
        const isActive = stage.id === active;
        const isComplete = index < activeIndex;
        const isLocked = lockIndex >= 0 && index > lockIndex;
        return (
          <div key={stage.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-accent text-white'
                  : isComplete
                    ? 'bg-accent/10 text-accent'
                    : isLocked
                      ? 'bg-surface text-muted opacity-50'
                      : 'bg-surface text-muted'
              }`}
            >
              <span>{index + 1}</span>
              <span>{stage.label}</span>
            </div>
            {index < STAGES.length - 1 ? (
              <span className="hidden text-muted sm:inline" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
