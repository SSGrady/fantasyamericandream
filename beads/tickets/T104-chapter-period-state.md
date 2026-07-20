---
id: T104
title: ChapterPeriod state model
status: done
type: feature
priority: P2
epic: E015
sprint: S018
depends_on:
  - T079
acceptance:
  - ChapterPeriod type with status planned | in_progress | closed
  - Transitions enforced: planned→in_progress on commit; in_progress→closed on chapter close
  - RunState stores current ChapterPeriod
  - Schema doc updated in state-model.md
---

# T104 - ChapterPeriod State Model

## Description

Typed ChapterPeriod lifecycle underpins chronology gates (T079) and live sim stage.

## Scope

- `packages/shared/src/types/`
- `docs/schema/state-model.md`

## Grill me

- One ChapterPeriod per six-month window, or sub-periods for interrupts?
- closed immutable forever, or admin reopen for debug?
- Sync status with XState or derive from it?
