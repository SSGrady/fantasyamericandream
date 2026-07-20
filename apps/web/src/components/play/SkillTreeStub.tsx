'use client';

import type { SkillTreeEntry } from '../../lib/play-session';

interface SkillTreeStubProps {
  skills: SkillTreeEntry[];
}

const STATUS_LABELS: Record<SkillTreeEntry['status'], string> = {
  locked: 'Locked',
  in_progress: 'In progress',
  unlocked: 'Unlocked',
};

const STATUS_STYLES: Record<SkillTreeEntry['status'], string> = {
  locked: 'bg-surface text-muted',
  in_progress: 'bg-amber-50 text-amber-800',
  unlocked: 'bg-emerald-50 text-emerald-800',
};

export function SkillTreeStub({ skills }: SkillTreeStubProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {skill.track}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">{skill.title}</p>
              {skill.unlocks.length > 0 ? (
                <p className="mt-1 text-xs text-muted">Unlocks: {skill.unlocks.join(', ')}</p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[skill.status]}`}
            >
              {STATUS_LABELS[skill.status]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
