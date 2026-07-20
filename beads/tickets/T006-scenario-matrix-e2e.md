---
id: T006
title: Scenario matrix end-to-end
status: done
type: feature
priority: P1
epic: E001
sprint: S002
depends_on: [T005]
acceptance:
  - 5 careers x 8 states rent-only fixtures in packages/data
  - tickSixMonthsWithSimulation runs each combo
  - Vitest asserts 40 scenarios complete with valid audit
---

# T006 - Scenario Matrix End-to-End

## Description

Run all V0 rent-only career/state combinations through the six-month simulation + audit loop.

## Completion (2026-07-19)

- `packages/data/src/scenarios/v0-rent-only.ts` - matrix builder and fixtures
- `packages/sim-engine/src/tick-month.ts` - `tickSixMonthsWithSimulation`
- `packages/sim-engine/src/__tests__/v0-scenario-matrix.test.ts` - 40 scenario Vitest matrix
