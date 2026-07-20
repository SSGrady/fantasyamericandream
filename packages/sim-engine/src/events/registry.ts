import type { EventDefinition } from '@fad/shared';
import { V0_STARTER_EVENT_DEFINITIONS } from './definitions/index.js';

const byId = new Map<string, EventDefinition>(
  V0_STARTER_EVENT_DEFINITIONS.map((definition) => [definition.id, definition]),
);

export function getEventDefinition(id: string): EventDefinition | undefined {
  return byId.get(id);
}

export function listEventDefinitions(): EventDefinition[] {
  return [...V0_STARTER_EVENT_DEFINITIONS];
}

export function assertEventRegistryComplete(expectedIds: readonly string[]): void {
  const missing = expectedIds.filter((id) => !byId.has(id));
  if (missing.length > 0) {
    throw new Error(`Missing event definitions: ${missing.join(', ')}`);
  }
}
