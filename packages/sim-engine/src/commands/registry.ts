import { ACTION_COMMAND_TYPES } from '@fad/shared';

export const COMMAND_REGISTRY_V1 = ACTION_COMMAND_TYPES;

export function assertCommandRegistryV1(): void {
  if (COMMAND_REGISTRY_V1.length < 15) {
    throw new Error(`Expected at least 15 commands, got ${COMMAND_REGISTRY_V1.length}`);
  }
}
