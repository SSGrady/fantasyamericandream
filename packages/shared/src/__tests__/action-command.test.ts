import { describe, expect, it } from 'vitest';
import {
  ActionCommandSchema,
  COMMAND_SCHEMA_VERSION,
  formatCommandPolicySummary,
  parseActionCommandsJson,
  parseSliderNumber,
  resolveCommandEffects,
  totalWeeklyCapacityUsed,
  validateCommandCapacity,
} from '../types/action-command.js';

describe('action commands', () => {
  it('round-trips JSON for all command variants', () => {
    const commands = [
      {
        id: 'c1',
        type: 'set_401k_deferral_rate',
        effectiveMonthKey: '2026-01',
        rate: 0.1,
      },
      {
        id: 'c2',
        type: 'set_hysa_auto_transfer',
        effectiveMonthKey: '2026-01',
        amountCents: 500_00,
      },
    ] as const;

    const parsed = parseActionCommandsJson(JSON.parse(JSON.stringify(commands)));
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.type).toBe('set_401k_deferral_rate');
  });

  it('validates capacity and resolves deferral effects', () => {
    const commands = parseActionCommandsJson([
      {
        id: 'c1',
        type: 'set_401k_deferral_rate',
        effectiveMonthKey: '2026-01',
        rate: 0.12,
      },
      {
        id: 'c2',
        type: 'set_job_search_intensity',
        effectiveMonthKey: '2026-01',
        intensity: 'aggressive',
      },
    ]);

    const capacity = validateCommandCapacity({ commands, weeklyCapacityHours: 14 });
    expect(capacity.ok).toBe(true);

    const effects = resolveCommandEffects(commands);
    expect(effects.deferral401kRate).toBe(0.12);
    expect(effects.jobSearchIntensity).toBe('aggressive');
  });

  it('rejects over-capacity command sets', () => {
    const commands = parseActionCommandsJson([
      {
        id: 'c1',
        type: 'set_side_gig_hours',
        effectiveMonthKey: '2026-01',
        hoursPerWeek: 10,
      },
      {
        id: 'c2',
        type: 'set_job_search_intensity',
        effectiveMonthKey: '2026-01',
        intensity: 'aggressive',
      },
    ]);

    expect(totalWeeklyCapacityUsed(commands)).toBe(18);
    const capacity = validateCommandCapacity({ commands, weeklyCapacityHours: 14 });
    expect(capacity.ok).toBe(false);
  });

  it('uses command schema version constant', () => {
    expect(COMMAND_SCHEMA_VERSION).toBe('command-v1');
    expect(ActionCommandSchema.def.options.length).toBeGreaterThanOrEqual(15);
  });

  it('formats money policies without hour units', () => {
    expect(
      formatCommandPolicySummary({
        id: 'c1',
        type: 'set_401k_deferral_rate',
        effectiveMonthKey: '2026-01',
        rate: 0.1,
      }),
    ).toBe('10%');
    expect(
      formatCommandPolicySummary({
        id: 'c2',
        type: 'set_hysa_auto_transfer',
        effectiveMonthKey: '2026-01',
        amountCents: 400_00,
      }),
    ).toBe('$400/mo');
    expect(
      formatCommandPolicySummary({
        id: 'c3',
        type: 'set_delivery_spend_cap',
        effectiveMonthKey: '2026-01',
        cap: 'medium',
      }),
    ).toBe('medium');
  });

  it('formats time policies with hour units', () => {
    expect(
      formatCommandPolicySummary({
        id: 'c4',
        type: 'set_job_search_intensity',
        effectiveMonthKey: '2026-01',
        intensity: 'medium',
      }),
    ).toBe('5h/wk');
  });

  it('parseSliderNumber rejects non-numeric values', () => {
    expect(parseSliderNumber('12', 0)).toBe(12);
    expect(parseSliderNumber({}, 3)).toBe(3);
    expect(parseSliderNumber(Number.NaN, 7)).toBe(7);
  });
});
