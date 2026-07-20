import {
  getDefaultV1RunConfig,
  type V1RunConfig,
} from '@fad/shared';

const STORAGE_KEY = 'fad:run-config';

export function saveRunConfig(config: V1RunConfig): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadRunConfig(): V1RunConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as V1RunConfig;
    if (!parsed.modules || !parsed.difficulty) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadOrCreateRunConfig(): V1RunConfig {
  return loadRunConfig() ?? getDefaultV1RunConfig();
}
