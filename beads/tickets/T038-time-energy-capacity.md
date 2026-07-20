---
id: T038
title: Time/energy capacity constraints
status: done
type: feature
priority: P1
epic: E005
sprint: S008
depends_on:
  - T037
acceptance:
  - Player has weekly time budget (hours) consumed by active commands
  - UI blocks over-capacity command submission with clear feedback
  - Sim-engine validates capacity before applying command effects
  - Capacity scales documented; default value in calibration JSON
---

# T038 - Time/Energy Capacity Constraints

## Description

Prevent players from toggling every optimization at once. Commands cost time/energy so tradeoffs are real.

## Scope

- Shared types, sim-engine validation
- Decision Day UI capacity meter

## Grill me

- Default capacity: 14 hrs/week side-hustle budget, or scale with life stage (no kids vs parent)?
- Do passive commands (401k percentage) cost zero capacity?
- Separate "energy" for stress-heavy commands (job search, relocation prep)?
