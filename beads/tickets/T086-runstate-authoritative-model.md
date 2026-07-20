---
id: T086
title: RunState authoritative model
status: open
type: feature
priority: P1
epic: E020
sprint: S015
depends_on: []
acceptance:
  - RunState type consolidates session, career, chapter, and command fields
  - Dexie persistence reads/writes RunState blob, not scattered session keys
  - Migration from legacy play session shape documented
  - Typecheck passes; no play route reads deprecated session helpers
---

# T086 - RunState Authoritative Model

## Description

Replace ad hoc play session fields with single authoritative RunState model. Foundation for selectors, chronology gates, and chapter shell.

## Scope

- `packages/shared` or `packages/domain` RunState type
- Dexie schema update (extends T076)
- Play session provider refactor

## Grill me

- RunState in `@fad/domain`, or `@fad/shared` with domain re-export?
- Version field on RunState for migrations?
- Server-authoritative RunState later, or client-only for V1.6?
