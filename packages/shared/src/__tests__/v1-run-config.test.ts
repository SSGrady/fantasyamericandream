import { describe, expect, it } from 'vitest';
import {
  V1_MODULE_IDS,
  enabledModulesFromV1RunConfig,
  getDefaultV1RunConfig,
} from '../types/v1-run-config.js';

describe('V1RunConfig', () => {
  it('defaults to medium difficulty with all simulation modules on', () => {
    const config = getDefaultV1RunConfig();
    expect(config.difficulty).toBe('medium');
    expect(config.hintsEnabled).toBe(true);
    expect(config.modules.economy.recessions).toBe(true);
    expect(config.modules.labor.ghostJobs).toBe(true);
    expect(config.modules.life.children).toBe(true);
    expect(config.modules.housing.severity).toBe('normal');
  });

  it('maps toggles to SimulationRun.enabledModules ids', () => {
    const config = getDefaultV1RunConfig();
    const modules = enabledModulesFromV1RunConfig(config);

    expect(modules).toContain(V1_MODULE_IDS.economyRecessions);
    expect(modules).toContain(V1_MODULE_IDS.laborGhostJobs);
    expect(modules).toContain(V1_MODULE_IDS.lifeRomance);
    expect(modules).toContain(V1_MODULE_IDS.hazardsWeather);
    expect(modules).toContain(V1_MODULE_IDS.housingHousePoor);
    expect(modules).toContain(V1_MODULE_IDS.housingHousePoorNormal);
    expect(modules).toContain(V1_MODULE_IDS.healthErVisits);
    expect(modules).toContain(V1_MODULE_IDS.gigRideshare);
    expect(modules).toContain(V1_MODULE_IDS.taxIrsAudits);
    expect(modules).toContain(V1_MODULE_IDS.hintsEnabled);
  });

  it('omits disabled modules and uses hard house-poor severity', () => {
    const config = getDefaultV1RunConfig();
    config.modules.economy.recessions = false;
    config.modules.housing.severity = 'hard';
    config.hintsEnabled = false;

    const modules = enabledModulesFromV1RunConfig(config);

    expect(modules).not.toContain(V1_MODULE_IDS.economyRecessions);
    expect(modules).toContain(V1_MODULE_IDS.housingHousePoorHard);
    expect(modules).not.toContain(V1_MODULE_IDS.housingHousePoorNormal);
    expect(modules).toContain(V1_MODULE_IDS.hintsDisabled);
    expect(modules).not.toContain(V1_MODULE_IDS.hintsEnabled);
  });
});
