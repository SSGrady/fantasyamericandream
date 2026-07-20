import { getDefaultV1RunConfig, type V1RunConfig } from '@fad/shared';
import { describe, expect, it } from 'vitest';
import { mergeRunConfig } from '../run-config';

describe('mergeRunConfig', () => {
  it('backfills insurance toggles when missing from stale session config', () => {
    const defaults = getDefaultV1RunConfig();
    const stale = JSON.parse(JSON.stringify(defaults)) as V1RunConfig;
    delete (stale.modules as { insurance?: unknown }).insurance;

    const merged = mergeRunConfig(stale, defaults);

    expect(merged.modules.insurance.termLife).toBe(false);
    expect(merged.modules.insurance.disability).toBe(false);
  });

  it('preserves user overrides while filling missing module sections', () => {
    const defaults = getDefaultV1RunConfig();
    const partial: Partial<V1RunConfig> = {
      difficulty: 'hard',
      modules: {
        ...defaults.modules,
        economy: { recessions: false, spVariability: true },
      },
    };
    delete (partial.modules as { insurance?: unknown }).insurance;

    const merged = mergeRunConfig(partial, defaults);

    expect(merged.difficulty).toBe('hard');
    expect(merged.modules.economy.recessions).toBe(false);
    expect(merged.modules.insurance.termLife).toBe(false);
  });
});
