'use client';

import type { ActionCommand } from '@fad/shared';
import { totalWeeklyCapacityUsed } from '@fad/shared';

const TIME_TYPES = [
  'set_side_gig_hours',
  'set_career_upskill_hours',
  'set_job_search_intensity',
] as const;

function findCommand<T extends ActionCommand['type']>(
  commands: ActionCommand[],
  type: T,
): Extract<ActionCommand, { type: T }> | undefined {
  return commands.find((command): command is Extract<ActionCommand, { type: T }> => command.type === type);
}

function upsertCommand(commands: ActionCommand[], next: ActionCommand): ActionCommand[] {
  const filtered = commands.filter((command) => command.type !== next.type);
  return [...filtered, next];
}

interface TimeCapacityPanelProps {
  commands: ActionCommand[];
  effectiveMonthKey: string;
  weeklyLimit: number;
  onChange: (commands: ActionCommand[]) => void;
}

export function TimeCapacityPanel({
  commands,
  effectiveMonthKey,
  weeklyLimit,
  onChange,
}: TimeCapacityPanelProps) {
  const sideGig = findCommand(commands, 'set_side_gig_hours');
  const upskill = findCommand(commands, 'set_career_upskill_hours');
  const jobSearch = findCommand(commands, 'set_job_search_intensity');

  const sideGigHours = sideGig?.hoursPerWeek ?? 0;
  const upskillHours = upskill?.hoursPerWeek ?? 0;
  const searchIntensity = jobSearch?.intensity ?? 'low';
  const used = totalWeeklyCapacityUsed(commands);

  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Time policies</p>
        <p className="mt-1 text-sm text-muted">
          Side gig hours add income; upskill and job search consume weekly capacity ({used}h / {weeklyLimit}
          h).
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">Side gig · {sideGigHours}h/wk</span>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={sideGigHours}
          onChange={(event) =>
            onChange(
              upsertCommand(commands, {
                id: sideGig?.id ?? `cmd-gig-${Date.now()}`,
                type: 'set_side_gig_hours',
                effectiveMonthKey,
                hoursPerWeek: Number(event.target.value),
              }),
            )
          }
          className="w-full accent-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">Career upskill · {upskillHours}h/wk</span>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={upskillHours}
          onChange={(event) =>
            onChange(
              upsertCommand(commands, {
                id: upskill?.id ?? `cmd-upskill-${Date.now()}`,
                type: 'set_career_upskill_hours',
                effectiveMonthKey,
                hoursPerWeek: Number(event.target.value),
              }),
            )
          }
          className="w-full accent-accent"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Job search intensity</legend>
        <div className="flex flex-wrap gap-2">
          {(['low', 'medium', 'aggressive'] as const).map((intensity) => (
            <button
              key={intensity}
              type="button"
              onClick={() =>
                onChange(
                  upsertCommand(commands, {
                    id: jobSearch?.id ?? `cmd-search-${Date.now()}`,
                    type: 'set_job_search_intensity',
                    effectiveMonthKey,
                    intensity,
                  }),
                )
              }
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                searchIntensity === intensity ? 'bg-accent text-white' : 'bg-surface text-muted'
              }`}
            >
              {intensity}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

export function isTimeCommand(type: ActionCommand['type']): boolean {
  return (TIME_TYPES as readonly string[]).includes(type);
}
