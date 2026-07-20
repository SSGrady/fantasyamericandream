import { describe, expect, it } from 'vitest';
import { assertCommandRegistryV1, COMMAND_REGISTRY_V1 } from '../commands/registry.js';
import { scheduleCommandsForMonth } from '../commands/scheduler.js';

describe('command registry v1', () => {
  it('defines at least 15 command types', () => {
    assertCommandRegistryV1();
    expect(COMMAND_REGISTRY_V1.length).toBeGreaterThanOrEqual(15);
  });

  it('schedules deferral command before monthly tick effects', () => {
    const result = scheduleCommandsForMonth({
      monthKey: '2026-02',
      weeklyCapacityHours: 14,
      activeCommands: [
        {
          id: 'cmd-401k',
          type: 'set_401k_deferral_rate',
          effectiveMonthKey: '2026-01',
          rate: 0.08,
        },
      ],
    });

    expect(result.effects.deferral401kRate).toBe(0.08);
  });
});
