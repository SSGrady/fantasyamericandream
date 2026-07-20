---
id: E002
title: V1 - Playable Game
status: done
priority: P1
sprints:
  - S003
  - S004
---

# E002 - V1: Playable Game

## Goal

Shippable web experience with President-simulator-style UI and the full consequence pipeline.

## Success Criteria

From [PLAN.md](../../PLAN.md) V1:

- [x] Scenario picker, character creator, module toggles (onboarding)
- [x] Core loop: briefing, decision day, impact analysis, reactions, net-worth audit
- [x] 30-50 events, skill tree v1, DreamHome lite (10 listings)
- [x] Endings: Coast FIRE, age 65, insolvency, voluntary exit, final report

Requires [ADR-007 UI interaction pattern](../../docs/adr/007-ui-consequence-pipeline.md).

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S003](../sprints/S003-v1-ui-shell/sprint.md) | UI shell and scenario select | Done |
| [S004](../sprints/S004-v1-content-depth/sprint.md) | Events, skill tree, DreamHome | Done |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T008](../tickets/T008-v1-ui-shell-scenario-select.md) | UI shell + scenario select | done |
| [T009](../tickets/T009-character-creator.md) | Character creator | done |
| [T010](../tickets/T010-module-toggles.md) | Module toggles | done |
| [T011](../tickets/T011-core-play-loop.md) | Core play loop screens | done |
| [T012](../tickets/T012-v1-content-endings.md) | V1 content and endings | done |
| [T013](../tickets/T013-expand-events.md) | Expand events to 30+ | done |
| [T014](../tickets/T014-skill-tree-v1.md) | Skill tree v1 UI | done |
| [T015](../tickets/T015-dreamhome-lite.md) | DreamHome lite | done |

## Follow-on Work

| Sprint / Epic | Scope |
|---------------|-------|
| [S005](../sprints/S005-v1-metrics-housing-fixes/sprint.md) | Metrics fix + housing/rent depth (T016-T019, T025) |
| [E004](./E004-trust-metric-integrity.md) | V1.5 P0 trust and metric integrity |
| [E005-E010](./E005-action-command-system.md) | V1.5 consequence-driven game loop |
| [E003](./E003-v2-household-simulator.md) | V2 Household Simulator |
