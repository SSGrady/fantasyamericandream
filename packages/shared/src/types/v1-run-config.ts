import type { Difficulty } from './game-state.js';

/** Dot-notation module IDs stored on SimulationRun.enabledModules. */
export const V1_MODULE_IDS = {
  economyRecessions: 'economy.recessions',
  economySpVariability: 'economy.sp_variability',
  laborGhostJobs: 'labor.ghost_jobs',
  laborMassLayoffs: 'labor.mass_layoffs',
  lifeRomance: 'life.romance',
  lifeDivorce: 'life.divorce',
  lifeChildren: 'life.children',
  hazardsWeather: 'hazards.weather',
  hazardsTransit: 'hazards.transit',
  hazardsTraffic: 'hazards.traffic',
  housingHousePoor: 'housing.house_poor',
  housingHousePoorNormal: 'housing.house_poor.normal',
  housingHousePoorHard: 'housing.house_poor.hard',
  healthErVisits: 'health.er_visits',
  gigRideshare: 'gig.rideshare',
  taxIrsAudits: 'tax.irs_audits',
  insuranceTermLife: 'insurance.term_life',
  insuranceDisability: 'insurance.disability',
  hintsEnabled: 'hints.enabled',
  hintsDisabled: 'hints.disabled',
} as const;

export type V1ModuleId = (typeof V1_MODULE_IDS)[keyof typeof V1_MODULE_IDS];

export type V1HousePoorSeverity = 'normal' | 'hard';

export interface V1ModuleToggles {
  economy: {
    recessions: boolean;
    spVariability: boolean;
  };
  labor: {
    ghostJobs: boolean;
    massLayoffs: boolean;
  };
  life: {
    romance: boolean;
    divorce: boolean;
    children: boolean;
  };
  hazards: {
    weather: boolean;
    transit: boolean;
    traffic: boolean;
  };
  housing: {
    housePoorEvents: boolean;
    severity: V1HousePoorSeverity;
  };
  health: {
    erVisits: boolean;
  };
  gig: {
    rideshareFulfillment: boolean;
  };
  tax: {
    irsAudits: boolean;
  };
  insurance: {
    termLife: boolean;
    disability: boolean;
  };
}

/** Pre-run settings persisted from the module toggles screen. */
export interface V1RunConfig {
  difficulty: Difficulty;
  hintsEnabled: boolean;
  modules: V1ModuleToggles;
}

export const V1_DIFFICULTY_OPTIONS: readonly {
  value: Difficulty;
  label: string;
  modifier: string;
}[] = [
  { value: 'easy', label: 'Easy', modifier: 'More runway, softer tail risks' },
  { value: 'medium', label: 'Medium', modifier: 'Baseline calibration' },
  { value: 'hard', label: 'Hard', modifier: 'Tighter margins, sharper shocks' },
] as const;

export const V1_HOUSE_POOR_SEVERITY_OPTIONS: readonly {
  value: V1HousePoorSeverity;
  label: string;
  modifier: string;
}[] = [
  { value: 'normal', label: 'Normal', modifier: '45% yearly house-poor event rate' },
  { value: 'hard', label: 'Hard', modifier: '55% yearly house-poor event rate' },
] as const;

const DEFAULT_MODULES: V1ModuleToggles = {
  economy: { recessions: true, spVariability: true },
  labor: { ghostJobs: true, massLayoffs: true },
  life: { romance: true, divorce: true, children: true },
  hazards: { weather: true, transit: true, traffic: true },
  housing: { housePoorEvents: true, severity: 'normal' },
  health: { erVisits: true },
  gig: { rideshareFulfillment: true },
  tax: { irsAudits: true },
  insurance: { termLife: false, disability: false },
};

export function getDefaultV1RunConfig(): V1RunConfig {
  return {
    difficulty: 'medium',
    hintsEnabled: true,
    modules: {
      economy: { ...DEFAULT_MODULES.economy },
      labor: { ...DEFAULT_MODULES.labor },
      life: { ...DEFAULT_MODULES.life },
      hazards: { ...DEFAULT_MODULES.hazards },
      housing: { ...DEFAULT_MODULES.housing },
      health: { ...DEFAULT_MODULES.health },
      gig: { ...DEFAULT_MODULES.gig },
      tax: { ...DEFAULT_MODULES.tax },
      insurance: { ...DEFAULT_MODULES.insurance },
    },
  };
}

/** Maps UI toggles to SimulationRun.enabledModules string list. */
export function enabledModulesFromV1RunConfig(config: V1RunConfig): string[] {
  const { modules } = config;
  const enabled: string[] = [];

  if (modules.economy.recessions) enabled.push(V1_MODULE_IDS.economyRecessions);
  if (modules.economy.spVariability) enabled.push(V1_MODULE_IDS.economySpVariability);
  if (modules.labor.ghostJobs) enabled.push(V1_MODULE_IDS.laborGhostJobs);
  if (modules.labor.massLayoffs) enabled.push(V1_MODULE_IDS.laborMassLayoffs);
  if (modules.life.romance) enabled.push(V1_MODULE_IDS.lifeRomance);
  if (modules.life.divorce) enabled.push(V1_MODULE_IDS.lifeDivorce);
  if (modules.life.children) enabled.push(V1_MODULE_IDS.lifeChildren);
  if (modules.hazards.weather) enabled.push(V1_MODULE_IDS.hazardsWeather);
  if (modules.hazards.transit) enabled.push(V1_MODULE_IDS.hazardsTransit);
  if (modules.hazards.traffic) enabled.push(V1_MODULE_IDS.hazardsTraffic);
  if (modules.housing.housePoorEvents) {
    enabled.push(V1_MODULE_IDS.housingHousePoor);
    enabled.push(
      modules.housing.severity === 'hard'
        ? V1_MODULE_IDS.housingHousePoorHard
        : V1_MODULE_IDS.housingHousePoorNormal,
    );
  }
  if (modules.health.erVisits) enabled.push(V1_MODULE_IDS.healthErVisits);
  if (modules.gig.rideshareFulfillment) enabled.push(V1_MODULE_IDS.gigRideshare);
  if (modules.tax.irsAudits) enabled.push(V1_MODULE_IDS.taxIrsAudits);
  if (modules.insurance.termLife) enabled.push(V1_MODULE_IDS.insuranceTermLife);
  if (modules.insurance.disability) enabled.push(V1_MODULE_IDS.insuranceDisability);
  enabled.push(
    config.hintsEnabled ? V1_MODULE_IDS.hintsEnabled : V1_MODULE_IDS.hintsDisabled,
  );

  return enabled;
}
