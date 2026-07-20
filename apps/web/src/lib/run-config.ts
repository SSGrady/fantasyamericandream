import {
  getDefaultV1RunConfig,
  type V1RunConfig,
} from '@fad/shared';

const STORAGE_KEY = 'fad:run-config';

/** Merge sessionStorage config with defaults; coerces missing fields for backwards compat. */
export function mergeRunConfig(
  parsed: Partial<V1RunConfig>,
  defaults: V1RunConfig,
): V1RunConfig {
  const modules = parsed.modules ?? defaults.modules;

  return {
    ...defaults,
    ...parsed,
    difficulty: parsed.difficulty ?? defaults.difficulty,
    hintsEnabled: parsed.hintsEnabled ?? defaults.hintsEnabled,
    modules: {
      economy: { ...defaults.modules.economy, ...modules.economy },
      labor: { ...defaults.modules.labor, ...modules.labor },
      life: { ...defaults.modules.life, ...modules.life },
      hazards: { ...defaults.modules.hazards, ...modules.hazards },
      housing: { ...defaults.modules.housing, ...modules.housing },
      health: { ...defaults.modules.health, ...modules.health },
      gig: { ...defaults.modules.gig, ...modules.gig },
      tax: { ...defaults.modules.tax, ...modules.tax },
      insurance: { ...defaults.modules.insurance, ...modules.insurance },
    },
  };
}

export function saveRunConfig(config: V1RunConfig): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadRunConfig(): V1RunConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<V1RunConfig>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return mergeRunConfig(parsed, getDefaultV1RunConfig());
  } catch {
    return null;
  }
}

export function loadOrCreateRunConfig(): V1RunConfig {
  return loadRunConfig() ?? getDefaultV1RunConfig();
}
