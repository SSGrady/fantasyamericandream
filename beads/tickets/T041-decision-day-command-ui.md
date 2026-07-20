---
id: T041
title: Decision Day command UI
status: open
type: feature
priority: P2
epic: E005
sprint: S008
depends_on:
  - T038
  - T040
acceptance:
  - `/play/decide` lists available commands with capacity cost and current values
  - Player submits command set; session stores for tick API
  - Validation errors inline before submit
  - Mobile-friendly layout (stacked cards)
---

# T041 - Decision Day Command UI

## Description

Replace sparse decision screen with command center for setting persistent intentions (full visual redesign in T062).

## Scope

- `apps/web/src/app/play/decide/`
- Play session command state

## Grill me

- Show recommended commands from literacy unlocks, or neutral list only?
- Allow saving command presets ("aggressive saver") for repeat turns?
- Confirm step before sim, or instant submit like President Career?
