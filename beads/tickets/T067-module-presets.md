---
id: T067
title: Module presets
status: open
type: feature
priority: P2
epic: E009
sprint: S012
depends_on: []
acceptance:
  - Presets: Guided, Realistic, Volatile, Harsh, Custom
  - Each preset maps to V1RunConfig module toggles and macro difficulty
  - Custom opens existing module toggles panel
  - Preset description copy sets player expectations
---

# T067 - Module Presets

## Description

Replace raw toggles with named experiences; Custom for power users.

## Scope

- `/create/modules` refactor
- Preset definitions in shared types

## Grill me

- Volatile vs Harsh: different macro seeds or event probability tables?
- Guided preset locks toggles mid-run, or suggestions only?
- Default preset for first-time players: Guided or Realistic?
