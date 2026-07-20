---
id: T020
title: Partner income payroll stub
status: in_progress
type: feature
priority: P1
epic: E003
sprint: S006
depends_on: []
acceptance:
  - HouseholdState with partner baseSalaryAnnual in shared types
  - Second earner payroll in monthly tick (W2 stub)
  - Character creator partner income when partnered or married
  - Wired through build-game-state and sim tick API
  - Dual-income household tests pass
---

# T020 - Partner Income Payroll Stub

## Description

First E003 slice: dual-income households. Partner salary posts as separate W2 payroll each month when `household.partner` is set.

## Scope

- `packages/shared` - `HouseholdState`, `PartnerState`, `GameState.household`
- `packages/ledger` - partner payroll in `buildMonthlyTransactions`
- `apps/web` - character creator field, build-game-state, sim tick request
- Tests in ledger and sim-engine

## Notes

Partner 401k deferral stub uses 5% default. Joint vs separate finance mode stored but not yet affecting account splits.
