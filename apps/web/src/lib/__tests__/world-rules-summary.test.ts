import { applyModulePreset, getDefaultV1RunConfig } from '@fad/shared';
import { describe, expect, it } from 'vitest';
import {
  countActiveModuleToggles,
  inferModulePresetId,
  summarizeWorldRules,
} from '../world-rules-summary';
import {
  parseOnboardingStepParam,
  shouldOpenModulesSheet,
  worldRulesDeepLink,
} from '../world-rules-url';

describe('world-rules-summary', () => {
  it('infers guided preset from applied config', () => {
    const config = applyModulePreset('guided');
    expect(inferModulePresetId(config)).toBe('guided');
  });

  it('returns custom when toggles diverge from presets', () => {
    const config = applyModulePreset('realistic');
    config.modules.tax.irsAudits = false;
    expect(inferModulePresetId(config)).toBe('custom');
  });

  it('summarizes difficulty and module count', () => {
    const config = getDefaultV1RunConfig();
    const summary = summarizeWorldRules(config);
    expect(summary).toContain('realistic');
    expect(summary).toContain('medium');
    expect(countActiveModuleToggles(config)).toBeGreaterThan(0);
  });
});

describe('world-rules-url', () => {
  it('parses world-rules step alias', () => {
    expect(parseOnboardingStepParam('world-rules')).toBe(4);
    expect(parseOnboardingStepParam('4')).toBe(4);
    expect(parseOnboardingStepParam('9')).toBeNull();
  });

  it('detects modules sheet open param', () => {
    expect(shouldOpenModulesSheet('open')).toBe(true);
    expect(shouldOpenModulesSheet('false')).toBe(false);
  });

  it('builds deep link with modules open', () => {
    expect(worldRulesDeepLink({ openModules: true })).toBe(
      '/create?step=world-rules&modules=open',
    );
  });
});
