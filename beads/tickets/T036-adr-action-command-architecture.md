---
id: T036
title: ADR action command architecture
status: done
type: adr
priority: P1
epic: E005
sprint: S008
depends_on: []
acceptance:
  - ADR-011 (or numbered next) documents ActionCommand lifecycle, persistence, replay
  - Commands are proposals; ledger applies validated deltas only
  - Relationship to PlayerState, run config, and interrupt overrides documented
  - Accepted ADR linked from E005 and ADR-010
---

# T036 - ADR Action Command Architecture

## Description

Define how persistent player intentions flow from Decision Day through monthly ticks with deterministic replay.

## Scope

- New ADR in `docs/adr/`
- Update `docs/adr/README.md`

## Grill me

- One active command per category (finance, career, lifestyle) or flat list with capacity?
- Can commands stack (raise 401k + increase job search) without conflict resolution rules?
- Version command schema independently of simulationVersion?
