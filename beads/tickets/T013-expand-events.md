---
id: T013
title: Expand events to 30+
status: done
type: feature
priority: P1
epic: E002
sprint: S004
depends_on: [T011]
acceptance:
  - 30+ event definitions in sim-engine registry
  - Random event roll wired into tickMonthsWithSimulation
  - Sampled events returned via API and surfaced in briefing narrative
---

# T013 - Expand Events to 30+

## Description

Add 10-15 V1 event definitions beyond the 20 V0 starters. Wire seeded event sampling into the six-month tick and expose occurrences in the briefing UI.

## Completion (2026-07-19)

- Added 12 events in `v1-expansion-events.ts` (32 total in registry).
- `rollEventsForMonth` / `rollEventsForPeriod` with eligibility, cooldowns, macro/difficulty modifiers.
- `tickMonthsWithSimulation` returns `sampledEvents`; briefing uses `renderBriefingEventsSummary`.
