---
id: T007
title: Event definitions + literacy stubs
status: done
type: feature
priority: P1
epic: E001
sprint: S002
depends_on: [T002]
acceptance:
  - 20 event definitions in packages/sim-engine/src/events/definitions/
  - EventDefinition types in packages/shared
  - 10 LiteracySkillId stubs in packages/shared
  - Registry lookup and Vitest coverage
---

# T007 - Event Definitions + Literacy Stubs

## Description

Schema-first V0 event catalog and literacy skill tree stubs before narrative layer.

## Completion (2026-07-19)

- `packages/shared/src/types/event-definition.ts` - EventDefinition types
- `packages/shared/src/types/literacy-skills.ts` - 10 skill stubs + default progress
- `packages/sim-engine/src/events/definitions/v0-starter-events.ts` - 20 starter events
- `packages/sim-engine/src/events/registry.ts` - lookup and completeness assert
- Vitest coverage in shared and sim-engine
