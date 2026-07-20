---
id: E003
title: V2 - Household Simulator
status: open
priority: P1
sprints:
  - S006
---

# E003 - V2: Household Simulator

## Goal

Expand Fantasy American Dream from single-player rent-only to household simulation: partner income, children, homeownership, insurance depth, relocation, gig work, divorce toggle, full state tax tables.

From [PLAN.md](../../PLAN.md) V2 and [feature-set.md](../../docs/vision/feature-set.md) sections D, F, H.

## Success Criteria

- [ ] Partner income and joint/separate finance modes
- [x] Dependents stub (count, childcare cost bands)
- [ ] Homeownership stub (mortgage, PMI, property tax)
- [ ] Term life and disability insurance stubs
- [ ] Divorce toggle with warning-sign driven fallout (not pure RNG)
- [ ] Relocation costs scaled to household size
- [ ] Full state tax table coverage beyond V0 stubs

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S006](../sprints/S006-v2-household-foundation/sprint.md) | Household foundation + dual income | In progress |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T020](../tickets/T020-partner-income-payroll.md) | Partner income payroll stub | in_progress |
| [T021](../tickets/T021-dependents-children-stub.md) | Dependents / children stub | done |
| [T022](../tickets/T022-homeownership-stub.md) | Homeownership stub | open |
| [T023](../tickets/T023-term-life-disability-stub.md) | Term life / disability stub | open |
| [T024](../tickets/T024-divorce-toggle-stub.md) | Divorce toggle stub | open |

## Related Epics

| Epic | Scope |
|------|-------|
| E002 | V1 Playable Game (complete) |
| E004 | V1.5 Trust and Metric Integrity |
| E005-E010 | V1.5 Game Loop (commands, chapter, lab, theater, onboarding, LLM) |
