---
id: T002
title: Shared types + ledger invariants
status: done
type: feature
priority: P1
epic: E001
sprint: S001
depends_on: [T001]
acceptance:
  - packages/shared exports SimulationRun, PlayerState, CareerState, Accounts, Debts types
  - packages/ledger exports applyTransactions and validateInvariants
  - Vitest tests cover invariants 1-4 from docs/schema/ledger-invariants.md
  - Golden fixture for simple checking + CC month
---

# T002 - Shared Types + Ledger Invariants

## Description

Implement core TypeScript types mirroring `docs/schema/state-model.md` and first ledger invariant tests.

## Completion Notes

Completed 2026-07-19. Added ledger transaction types, applyTransactions, validateInvariants, golden fixture, and invariant tests 1-4.
