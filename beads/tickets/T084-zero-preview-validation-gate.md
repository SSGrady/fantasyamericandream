---
id: T084
title: Zero-preview validation gate
status: open
type: bug
priority: P0
epic: E012
sprint: S015
depends_on: []
acceptance:
  - Impact preview with zero net effect shows explicit explanation or is blocked
  - Command validation gate rejects no-op command bundles before sim dispatch
  - Player sees which commands would change outcomes vs which are redundant
  - No silent "0 change" preview without copy
---

# T084 - Zero-Preview Validation Gate

## Description

Playthrough hit zero-effect consequence previews when submitted commands matched baseline. Add validation gate before preview sim and surface why preview is flat.

## Scope

- Impact API `/api/sim/impact`
- CommandCenter submit path
- Processing page preview

## Feedback

Zero-effect consequence preview undermines agency; feels like broken sim.

## Grill me

- Block submit when all commands are no-ops, or allow with warning?
- Compare command hash to last committed plan, or to sim baseline?
- Show diff table of command fields that differ from baseline?
