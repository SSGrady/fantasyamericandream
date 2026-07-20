export const WORLD_RULES_STEP = 4;

export function parseOnboardingStepParam(value: string | null): number | null {
  if (value === 'world-rules') return WORLD_RULES_STEP;
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4) return null;
  return parsed;
}

export function shouldOpenModulesSheet(modulesParam: string | null): boolean {
  return modulesParam === 'open' || modulesParam === '1' || modulesParam === 'true';
}

export function worldRulesDeepLink(options?: { openModules?: boolean }): string {
  const params = new URLSearchParams({ step: 'world-rules' });
  if (options?.openModules) {
    params.set('modules', 'open');
  }
  return `/create?${params.toString()}`;
}
