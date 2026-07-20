---
id: T039
title: Persistent command scheduler
status: done
type: feature
priority: P1
epic: E005
sprint: S008
depends_on:
  - T037
acceptance:
  - Commands persist across all monthly ticks within a six-month chapter
  - Monthly tick applies command effects before event rolls
  - Command cancel/replace mid-chapter handled deterministically
  - Golden test: same seed + commands → identical ledger as full replay
---

# T039 - Persistent Command Scheduler

## Description

Wire sim-engine monthly tick to honor active commands from chapter start through audit.

## Scope

- `packages/sim-engine/src/tick-month.ts`
- Command application module

## Grill me

- Apply commands on tick 1 of chapter or allow mid-month effective dates?
- Interrupt events pause certain commands (layoff pauses 401k increase)?
- Persist command queue in Dexie (E011) or session-only until S014?
