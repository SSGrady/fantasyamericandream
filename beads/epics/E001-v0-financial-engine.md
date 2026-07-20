---
id: E001
title: V0 - Financial Engine Prototype
status: done
priority: P1
sprints:
  - S001
  - S002
---

# E001 - V0: Financial Engine Prototype

## Goal

Prove monthly ledger + six-month audit loop with seeded replay before UI polish.

## Success Criteria

- [x] Monthly payroll, tax withholding, interest, investment returns post correctly
- [x] Six-month audit snapshot with net-worth waterfall
- [x] 5 careers × 8 states rent-only scenarios run end-to-end
- [x] Layoff hazard + job-search stub affects career state
- [x] Macro regime affects correlated returns and layoff climate
- [x] Same seed + choices → identical net worth (determinism test)
- [x] 20 event definitions + 10 literacy skill stubs in schema

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S001](../sprints/S001-v0-scaffold/sprint.md) | Scaffold & core ledger | Done |
| [S002](../sprints/S002-v0-scenarios-events/sprint.md) | Scenarios & event schema | Done |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T001](../tickets/T001-repo-scaffold.md) | Repo scaffold | done |
| [T002](../tickets/T002-shared-types-ledger-invariants.md) | Shared types + ledger invariants | done |
| [T003](../tickets/T003-monthly-payroll-tax-postings.md) | Monthly payroll & tax postings | done |
| [T004](../tickets/T004-six-month-audit-tick.md) | Six-month audit tick | done |
| [T005](../tickets/T005-layoff-macro-market-stub.md) | Layoff + macro + market stub | done |
| [T006](../tickets/T006-scenario-matrix-e2e.md) | Scenario matrix end-to-end | done |
| [T007](../tickets/T007-event-definitions-literacy-stubs.md) | Event definitions + literacy stubs | done |

## Follow-on Epics

| Epic | Scope | Status |
|------|-------|--------|
| [E002](../epics/E002-v1-playable-game.md) | V1 Playable Game (UI consequence pipeline) | Done |
| [E003](../epics/E003-v2-household-simulator.md) | V2 Household Simulator | In progress |
| [E004](../epics/E004-trust-metric-integrity.md) | V1.5 Trust and Metric Integrity | Open |
