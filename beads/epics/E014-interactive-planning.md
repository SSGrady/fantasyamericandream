---
id: E014
title: Interactive Planning
status: done
priority: P2
sprints:
  - S017
---

# E014 - Interactive Planning (P2)

## Goal

Turn planning from a static form into an interactive policy lab. Players adjust money and time policies with live projections and commit a plan before simulation runs.

## Success Criteria

- [ ] Money policies: sliders/steppers for 401k, Roth, HYSA, delivery cap, etc.
- [ ] Time policies: capacity allocation (job search, cooking, gig, relationships)
- [ ] Money cost separated from weekly hours (401k is NOT 0h/wk)
- [ ] Live projections update as player edits policies
- [ ] Plan summary with explicit "Commit this plan" CTA

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S017](../sprints/S017-interactive-planning/sprint.md) | Interactive planning controls | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T094](../tickets/T094-money-policy-sliders.md) | Money policy sliders | open |
| [T095](../tickets/T095-time-capacity-allocation.md) | Time capacity allocation | open |
| [T096](../tickets/T096-separate-money-from-hours.md) | Separate money from hours | open |
| [T097](../tickets/T097-live-plan-projections.md) | Live plan projections | open |
| [T098](../tickets/T098-plan-summary-commit-cta.md) | Plan summary commit CTA | open |
| [T099](../tickets/T099-money-vs-time-planning-controls.md) | Money vs time planning controls | open |

## Depends On

- [E013](./E013-persistent-chapter-shell.md) - Plan stage lives inside chapter shell
- [E005](./E005-action-command-system.md) - command vocabulary

## Related

- [ADR 011](../../docs/adr/011-action-command-system.md)
- [ADR 014](../../docs/adr/014-chapter-shell-and-chronology.md)
