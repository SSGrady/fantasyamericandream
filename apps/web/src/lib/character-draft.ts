import {
  getDefaultV1CharacterDraft,
  isHousingArrangementAllowed,
  type V1CharacterDraft,
  type V1StarterScenarioId,
} from '@fad/shared';

const STORAGE_KEY = 'fad:character-draft';

export function createDefaultDraft(scenarioId: V1StarterScenarioId): V1CharacterDraft {
  return getDefaultV1CharacterDraft(scenarioId);
}

/** Merge a sessionStorage draft with defaults; coerces missing fields for backwards compat. */
export function mergeDraft(
  parsed: Partial<V1CharacterDraft> & Pick<V1CharacterDraft, 'scenarioId'>,
  defaults: V1CharacterDraft,
): V1CharacterDraft {
  const maritalStatus = parsed.maritalStatus ?? defaults.maritalStatus;
  const housingArrangement =
    parsed.housingArrangement && isHousingArrangementAllowed(parsed.housingArrangement, maritalStatus)
      ? parsed.housingArrangement
      : defaults.housingArrangement;

  return {
    ...defaults,
    ...parsed,
    maritalStatus,
    housingArrangement,
    relationshipSimulation: parsed.relationshipSimulation ?? defaults.relationshipSimulation,
    partnerIncomeAnnual: parsed.partnerIncomeAnnual ?? defaults.partnerIncomeAnnual,
    dependentsCount: parsed.dependentsCount ?? defaults.dependentsCount,
    childrenPlanned: parsed.childrenPlanned ?? defaults.childrenPlanned,
    includeEmployerHealthPlan: parsed.includeEmployerHealthPlan ?? defaults.includeEmployerHealthPlan,
    habits: {
      ...defaults.habits,
      ...parsed.habits,
    },
    balanceSheet: {
      ...defaults.balanceSheet,
      ...parsed.balanceSheet,
      brokerage: parsed.balanceSheet?.brokerage ?? defaults.balanceSheet.brokerage,
    },
  };
}

export function saveCharacterDraft(draft: V1CharacterDraft): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadCharacterDraft(): V1CharacterDraft | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<V1CharacterDraft> & Pick<V1CharacterDraft, 'scenarioId'>;
    if (!parsed.scenarioId) return null;
    return mergeDraft(parsed, createDefaultDraft(parsed.scenarioId));
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
  return createDefaultDraft(scenarioId);
}
