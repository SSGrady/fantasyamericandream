---
id: T026
title: Baseline living expenses stub
status: done
type: feature
priority: P1
epic: E002
sprint: S005
depends_on: [T016]
acceptance:
  - Living expenses post monthly to expense accounts from calibration stubs
  - Groceries modified by cookingSkill and deliveryFrequency
  - Utilities split by housing arrangement fraction
  - Emergency runway and waterfall include new expense lines
  - Character creator toggles employer health plan
  - CA tech audit checking stays well below pre-fix levels
  - metrics-definitions.md documents baseline burn
---

# T026 - Baseline Living Expenses Stub

## Description

Simulation was too generous: only rent and debt posted, so checking accumulated unspent net pay (~$53k after six months). Added Payday Playbook-calibrated baseline living expenses on the monthly tick.

## Scope

- `packages/ledger/src/living-expenses.ts` - compute and post health insurance, utilities, groceries, subscriptions
- `packages/ledger/src/monthly-tick.ts` - wire after payroll
- `packages/ledger/src/metrics.ts`, `audit.ts` - runway and waterfall
- `apps/web` - character creator health plan toggle, impact analysis disclaimer
- `docs/schema/metrics-definitions.md`

## Completion

2026-07-19: Baseline living expenses stub wired into monthly tick, metrics, UI, and tests. V0 default checking raised to $15k to keep lower-income scenarios solvent through six months.
