import {
  applyModulePreset,
  enabledModulesFromV1RunConfig,
  type ModulePresetId,
  type V1RunConfig,
} from '@fad/shared';

function configsEqual(a: V1RunConfig, b: V1RunConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function inferModulePresetId(config: V1RunConfig): ModulePresetId {
  const presets: ModulePresetId[] = ['guided', 'realistic', 'volatile', 'harsh'];
  for (const preset of presets) {
    if (configsEqual(config, applyModulePreset(preset))) {
      return preset;
    }
  }
  return 'custom';
}

export function countActiveModuleToggles(config: V1RunConfig): number {
  return enabledModulesFromV1RunConfig(config).filter(
    (id) => !id.startsWith('hints.'),
  ).length;
}

export function summarizeWorldRules(config: V1RunConfig): string {
  const preset = inferModulePresetId(config);
  const active = countActiveModuleToggles(config);
  const hints = config.hintsEnabled ? 'hints on' : 'hardcore';
  return `${preset} · ${config.difficulty} · ${active} modules · ${hints}`;
}

export const WORLD_RULES_PRESETS: ModulePresetId[] = [
  'guided',
  'realistic',
  'volatile',
  'harsh',
];
