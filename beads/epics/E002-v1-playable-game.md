---
id: E002
title: V1 - Playable Game
status: in_progress
priority: P1
sprints:
  - S003
---

# E002 - V1: Playable Game

## Goal

Shippable web experience with President-simulator-style UI and the full consequence pipeline.

## Success Criteria

From [PLAN.md](../../PLAN.md) V1:

- [ ] Scenario picker, character creator, module toggles (onboarding)
- [ ] Core loop: briefing, decision day, impact analysis, reactions, net-worth audit
- [ ] 30-50 events, skill tree v1, DreamHome lite (10 listings)
- [ ] Endings: Coast FIRE, age 65, insolvency, voluntary exit, final report

Requires [ADR-007 UI interaction pattern](../../docs/adr/007-ui-consequence-pipeline.md).

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S003](../sprints/S003-v1-ui-shell/sprint.md) | UI shell and scenario select | In progress |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T008](../tickets/T008-v1-ui-shell-scenario-select.md) | UI shell + scenario select | done |
| [T009](../tickets/T009-character-creator.md) | Character creator | open |
| [T010](../tickets/T010-module-toggles.md) | Module toggles | open |
| [T011](../tickets/T011-core-play-loop.md) | Core play loop screens | open |
| [T012](../tickets/T012-v1-content-endings.md) | V1 content and endings | open |

## Follow-on Epics (planned)

| Epic | Scope |
|------|-------|
| E003 | V2 Household Simulator |
| E004 | V3 Platform |
