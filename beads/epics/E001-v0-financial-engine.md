---
id: E001
title: V0 - Financial Engine Prototype
status: in_progress
priority: P1
sprints:
  - S001
---

# E001 - V0: Financial Engine Prototype

## Goal

Prove monthly ledger + six-month audit loop with seeded replay before UI polish.

## Success Criteria

- [ ] Monthly payroll, tax withholding, interest, investment returns post correctly
- [x] Six-month audit snapshot with net-worth waterfall
- [ ] 5 careers × 8 states rent-only scenarios run end-to-end
- [ ] Layoff hazard + job-search stub affects career state
- [ ] Macro regime affects correlated returns and layoff climate
- [ ] Same seed + choices → identical net worth (determinism test)
- [ ] 20 event definitions + 10 literacy skill stubs in schema

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S001](../sprints/S001-v0-scaffold/sprint.md) | Scaffold & core ledger | In progress |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T001](../tickets/T001-repo-scaffold.md) | Repo scaffold | done |
| [T002](../tickets/T002-shared-types-ledger-invariants.md) | Shared types + ledger invariants | done |
| [T003](../tickets/T003-monthly-payroll-tax-postings.md) | Monthly payroll & tax postings | done |
| [T004](../tickets/T004-six-month-audit-tick.md) | Six-month audit tick | done |
| [T005](../tickets/T005-layoff-macro-market-stub.md) | Layoff + macro + market stub | open |

## Follow-on Epics (planned)

| Epic | Scope |
|------|-------|
| E002 | V1 Playable Game (UI consequence pipeline) |
| E003 | V2 Household Simulator |
| E004 | V3 Platform |
