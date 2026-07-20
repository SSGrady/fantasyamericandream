---
id: T037
title: ActionCommand discriminated union
status: open
type: feature
priority: P1
epic: E005
sprint: S008
depends_on:
  - T036
acceptance:
  - ActionCommand discriminated union in packages/shared with Zod schemas
  - Each variant has id, effectiveMonth, parameters typed per command
  - Serialized on SimulationRun / PlayerState for replay
  - Unit tests for round-trip JSON parse
---

# T037 - ActionCommand Discriminated Union

## Description

Typed command vocabulary shared by sim-engine, web UI, and narrative layer.

## Scope

- `packages/shared/src/types/action-command.ts`
- Schema doc stub in `docs/schema/`

## Grill me

- Namespace commands by domain (`finance.*`, `career.*`) or flat `type` string enum?
- Store commands on PlayerState or separate `ActiveCommands[]` on run?
- Include command history for audit, or only current active set?
