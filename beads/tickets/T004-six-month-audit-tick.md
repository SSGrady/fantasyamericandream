---
id: T004
title: Six-month audit tick
status: done
type: feature
priority: P1
epic: E001
sprint: S001
depends_on: [T003]
acceptance:
  - tickSixMonths runs 6 monthly ticks
  - AuditSnapshot includes netWorth, delta, waterfall lines
  - Contribution progress for 401k and Roth limits
  - JSON export suitable for CLI inspection
---

# T004 - Six-Month Audit Tick

## Description

Orchestrate six monthly ledger ticks and produce player-facing audit snapshot.

## Completion (2026-07-19)

- `tickSixMonths` in `packages/ledger/src/audit.ts` runs 6 `applyMonthlyTick` cycles.
- `buildAuditSnapshot` produces net worth, delta, waterfall, savings rate, runway, contribution progress.
- `exportAuditJson` for CLI inspection; golden fixture `six-month-audit-jan-jun.json`.
- Re-exported from `@fad/sim-engine`.
