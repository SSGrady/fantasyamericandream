---
id: E005
title: Action Command System
status: open
priority: P1
sprints:
  - S008
---

# E005 - Action Command System (P1)

## Goal

Replace one-shot configuration with a persistent **command vocabulary** that players set on Decision Day and that the simulation honors across monthly ticks.

## Success Criteria

- [ ] ADR accepted for ActionCommand architecture
- [ ] Discriminated union types for ~15 v1 commands
- [ ] Time/energy capacity limits concurrent active commands
- [ ] Commands persist and replay deterministically across monthly ticks
- [ ] Decision Day UI submits commands, not just toggles
- [ ] Command state stored on PlayerState / run config with replay metadata

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S008](../sprints/S008-action-commands-foundation/sprint.md) | Command vocabulary foundation | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T036](../tickets/T036-adr-action-command-architecture.md) | ADR action command architecture | open |
| [T037](../tickets/T037-action-command-types.md) | ActionCommand discriminated union | open |
| [T038](../tickets/T038-time-energy-capacity.md) | Time/energy capacity constraints | open |
| [T039](../tickets/T039-persistent-command-scheduler.md) | Persistent command scheduler | open |
| [T040](../tickets/T040-command-vocabulary-v1.md) | Command vocabulary v1 (~15 actions) | open |
| [T041](../tickets/T041-decision-day-command-ui.md) | Decision Day command UI | open |

## Depends On

- [E004](./E004-trust-metric-integrity.md) - players must trust metrics before commands matter

## Related

- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
- [E006](./E006-chapter-vertical-slice.md)
