import { addMonthsToIsoDate, monthKeyAdd, monthKeyFromIsoDate } from '@fad/ledger';
import type {
  CareerState,
  Difficulty,
  EventDefinition,
  HouseholdState,
  IsoDate,
  LocationState,
  MacroState,
  SampledEventOccurrence,
} from '@fad/shared';
import { listEventDefinitions } from './registry.js';

export interface EventRollContext {
  monthIndex: number;
  monthKey: string;
  startDate: IsoDate;
  randomSeed: string;
  career: CareerState;
  location: LocationState;
  macro: MacroState;
  difficulty: Difficulty;
  cooldowns: Map<string, number>;
  enabledModules?: string[];
  household?: Pick<HouseholdState, 'maritalStatus' | 'relationshipHealth'>;
}

function isEligible(definition: EventDefinition, context: EventRollContext): boolean {
  const { eligibility } = definition;
  if (!eligibility) return true;

  if (eligibility.employmentType && eligibility.employmentType !== context.career.employmentType) {
    return false;
  }
  if (
    eligibility.minTenureMonths !== undefined &&
    context.career.tenureMonths < eligibility.minTenureMonths
  ) {
    return false;
  }
  if (eligibility.housingMode && eligibility.housingMode !== context.location.housingMode) {
    return false;
  }
  if (eligibility.sectors && !eligibility.sectors.includes(context.career.sector)) {
    return false;
  }
  if (
    eligibility.requiredModule &&
    !(context.enabledModules ?? []).includes(eligibility.requiredModule)
  ) {
    return false;
  }
  if (eligibility.maritalStatus) {
    if (!context.household) {
      return false;
    }
    if (!eligibility.maritalStatus.includes(context.household.maritalStatus)) {
      return false;
    }
  }
  if (eligibility.maxRelationshipHealth !== undefined) {
    if (!context.household) {
      return false;
    }
    if (context.household.relationshipHealth > eligibility.maxRelationshipHealth) {
      return false;
    }
  }
  if (eligibility.minRelationshipHealth !== undefined) {
    if (!context.household) {
      return false;
    }
    if (context.household.relationshipHealth < eligibility.minRelationshipHealth) {
      return false;
    }
  }

  const cooldownRemaining = context.cooldowns.get(definition.id);
  if (cooldownRemaining !== undefined && cooldownRemaining > 0) {
    return false;
  }

  return true;
}

function effectiveProbability(definition: EventDefinition, context: EventRollContext): number {
  const base = definition.baseProbabilityPerMonth ?? 0;
  let probability = base;

  if (definition.modifiers?.macroRegime) {
    const multiplier = definition.modifiers.macroRegime[context.macro.regime] ?? 1;
    probability *= multiplier;
  }
  if (definition.modifiers?.difficulty) {
    const multiplier = definition.modifiers.difficulty[context.difficulty] ?? 1;
    probability *= multiplier;
  }

  return Math.min(probability, 0.95);
}

function pickSeverityId(definition: EventDefinition, rng: () => number): string {
  const severity = definition.severity;
  if (!severity || severity.outcomes.length === 0) return 'default';

  if (severity.distribution === 'fixed') {
    return severity.outcomes[0]?.id ?? 'default';
  }

  const totalWeight = severity.outcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
  let roll = rng() * totalWeight;
  for (const outcome of severity.outcomes) {
    roll -= outcome.weight;
    if (roll <= 0) return outcome.id;
  }

  return severity.outcomes[severity.outcomes.length - 1]?.id ?? 'default';
}

function monthRng(randomSeed: string, monthIndex: number): () => number {
  let state = 0;
  const seed = `${randomSeed}:events:${monthIndex}`;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state + seed.charCodeAt(i) * (i + 1)) >>> 0;
  }
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function rollEventsForMonth(
  context: EventRollContext,
  rng: () => number,
): SampledEventOccurrence[] {
  const definitions = listEventDefinitions().filter((definition) => isEligible(definition, context));
  const quiet = definitions.find((definition) => definition.id === 'quiet_month');

  if (quiet) {
    const quietProbability = effectiveProbability(quiet, context);
    if (rng() < quietProbability) {
      return [
        {
          eventId: quiet.id,
          title: quiet.title,
          category: quiet.category,
          monthIndex: context.monthIndex,
          monthKey: context.monthKey,
          monthDate: addMonthsToIsoDate(context.startDate, context.monthIndex),
          severityId: pickSeverityId(quiet, rng),
          interruptsHalfYearPacing: quiet.interruptsHalfYearPacing ?? false,
        },
      ];
    }
  }

  const occurrences: SampledEventOccurrence[] = [];

  for (const definition of definitions) {
    if (definition.id === 'quiet_month') continue;

    const probability = effectiveProbability(definition, context);
    if (probability <= 0) continue;
    if (rng() >= probability) continue;

    occurrences.push({
      eventId: definition.id,
      title: definition.title,
      category: definition.category,
      monthIndex: context.monthIndex,
      monthKey: context.monthKey,
      monthDate: addMonthsToIsoDate(context.startDate, context.monthIndex),
      severityId: pickSeverityId(definition, rng),
      interruptsHalfYearPacing: definition.interruptsHalfYearPacing ?? false,
    });

    if (definition.cooldownMonths) {
      context.cooldowns.set(definition.id, definition.cooldownMonths);
    }
  }

  return occurrences;
}

export interface RollEventsInput {
  startDate: IsoDate;
  months: number;
  randomSeed: string;
  career: CareerState;
  location: LocationState;
  macro: MacroState;
  difficulty: Difficulty;
  enabledModules?: string[];
  household?: Pick<HouseholdState, 'maritalStatus' | 'relationshipHealth'>;
}

export function rollEventsForPeriod(input: RollEventsInput): SampledEventOccurrence[] {
  const cooldowns = new Map<string, number>();
  const allOccurrences: SampledEventOccurrence[] = [];
  const startMonthKey = monthKeyFromIsoDate(input.startDate);

  for (let monthIndex = 0; monthIndex < input.months; monthIndex += 1) {
    for (const [eventId, remaining] of cooldowns.entries()) {
      if (remaining <= 1) cooldowns.delete(eventId);
      else cooldowns.set(eventId, remaining - 1);
    }

    const monthKey = monthKeyAdd(startMonthKey, monthIndex);
    const rng = monthRng(input.randomSeed, monthIndex);
    const context: EventRollContext = {
      monthIndex,
      monthKey,
      startDate: input.startDate,
      randomSeed: input.randomSeed,
      career: input.career,
      location: input.location,
      macro: input.macro,
      difficulty: input.difficulty,
      cooldowns,
      enabledModules: input.enabledModules,
      household: input.household,
    };

    const monthEvents = rollEventsForMonth(context, rng);
    allOccurrences.push(...monthEvents);
  }

  return allOccurrences;
}
