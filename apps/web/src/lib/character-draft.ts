import {
  getDefaultV1CharacterDraft,
  type V1CharacterDraft,
  type V1StarterScenarioId,
} from '@fad/shared';

const STORAGE_KEY = 'fad:character-draft';

export function saveCharacterDraft(draft: V1CharacterDraft): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadCharacterDraft(): V1CharacterDraft | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as V1CharacterDraft;
    if (!parsed.scenarioId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadOrCreateCharacterDraft(
  scenarioId: V1StarterScenarioId,
): V1CharacterDraft {
  const existing = loadCharacterDraft();
  if (existing && existing.scenarioId === scenarioId) {
    return existing;
  }
  return getDefaultV1CharacterDraft(scenarioId);
}
