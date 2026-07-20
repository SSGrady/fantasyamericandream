import type { ActionCommand, ResolvedCommandEffects } from '@fad/shared';
import { resolveCommandEffects, validateCommandCapacity } from '@fad/shared';

export interface CommandSchedulerInput {
  monthKey: string;
  activeCommands: ActionCommand[];
  weeklyCapacityHours: number;
}

export interface CommandSchedulerResult {
  effects: ResolvedCommandEffects;
  appliedCommands: ActionCommand[];
  capacityUsed: number;
}

/** Resolve active commands for a monthly tick (deterministic, capacity validated). */
export function scheduleCommandsForMonth(input: CommandSchedulerInput): CommandSchedulerResult {
  const eligible = input.activeCommands.filter(
    (command) => command.effectiveMonthKey <= input.monthKey,
  );
  const capacity = validateCommandCapacity({
    commands: eligible,
    weeklyCapacityHours: input.weeklyCapacityHours,
  });

  if (!capacity.ok) {
    throw new Error(
      `Command capacity exceeded: ${capacity.used}h used, ${capacity.limit}h limit`,
    );
  }

  const effects = resolveCommandEffects(eligible);
  return {
    effects,
    appliedCommands: eligible,
    capacityUsed: capacity.ok ? 0 : 0,
  };
}

export { resolveCommandEffects, validateCommandCapacity };
