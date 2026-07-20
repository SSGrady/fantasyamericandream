---
id: E015
title: Live Chapter Simulation
status: open
priority: P3
sprints:
  - S018
---

# E015 - Live Chapter Simulation (P3)

## Goal

Make the six-month window feel lived, not batch-processed. Month-by-month animation, mid-timeline interrupts, and directional previews replace static Decision Day and Processing screens.

## Success Criteria

- [ ] Month rail animates Feb through Jul during live phase
- [ ] Interrupts appear on timeline (e.g. RTO in April), not only on static Decision Day
- [ ] Consequence preview shows directional uncertainty, not false certainty
- [ ] Player can commit and continue through remaining months after interrupt
- [ ] `ChapterPeriod` state: `planned | in_progress | closed`

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S018](../sprints/S018-live-timeline-simulation/sprint.md) | Live timeline simulation | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T100](../tickets/T100-month-rail-animation.md) | Month rail animation | open |
| [T101](../tickets/T101-timeline-interrupt-overlay.md) | Timeline interrupt overlay | open |
| [T102](../tickets/T102-directional-consequence-preview.md) | Directional consequence preview | open |
| [T103](../tickets/T103-commit-continue-remaining-months.md) | Commit and continue months | open |
| [T104](../tickets/T104-chapter-period-state.md) | ChapterPeriod state model | open |
| [T105](../tickets/T105-month-rail-interrupt-integration.md) | Month rail interrupt integration | open |

## Depends On

- [E013](./E013-persistent-chapter-shell.md) - Live stage in chapter shell
- [E014](./E014-interactive-planning.md) - plan must be committed before live sim

## Related

- [E006](./E006-chapter-vertical-slice.md) - interrupt events (T045)
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
