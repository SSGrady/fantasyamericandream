---
id: T076
title: Dexie persistence layer
status: open
type: feature
priority: P2
epic: E011
sprint: S014
depends_on:
  - T048
acceptance:
  - Dexie schema for run state, chapter progress, command history, replay metadata
  - Save on phase boundary and before sim tick
  - Resume interrupted chapter from last phase
  - Export/import run blob for shareable seed challenges (local JSON)
---

# T076 - Dexie Persistence Layer

## Description

Replace session-only storage so chapters survive refresh and support replay metadata.

## Scope

- `apps/web/src/lib/persistence/` or packages/domain
- Dexie version migrations

## Grill me

- One table per entity, or single run blob JSON column?
- Clear data on new game always, or prompt resume?
- Sync to cloud deferred to V3 entirely?
