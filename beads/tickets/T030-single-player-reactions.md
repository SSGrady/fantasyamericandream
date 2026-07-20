---
id: T030
title: Single-player reaction gating
status: open
type: bug
priority: P1
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Reactions page skips partner voice when household mode is single
  - Substitute future-self or planner voice when partner unavailable
  - No empty partner card or placeholder apology text
  - E2E or unit test for single vs dual household reaction sets
---

# T030 - Single-Player Reaction Gating

## Description

Stakeholder reactions reference a partner when the player created a single character. Gate voices on household state.

## Scope

- `packages/narrative/`
- `apps/web/src/app/play/reactions/`
- ADR-007 stakeholder mapping

## Grill me

- Which substitute voice for single players: future self, fee-only planner, or silent skip?
- When partner module is off but household stub exists, which flag is source of truth?
- Should dual-income stub (T020) always enable partner reactions even if narrative says "roommate"?
