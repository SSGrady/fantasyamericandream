import type { V1StarterScenarioId } from '@fad/shared';

const STORAGE_KEY = 'fad:selected-scenario';

export function saveSelectedScenario(id: V1StarterScenarioId): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function loadSelectedScenario(): V1StarterScenarioId | null {
  if (typeof window === 'undefined') return null;
  const value = sessionStorage.getItem(STORAGE_KEY);
  return value as V1StarterScenarioId | null;
}
