---
id: T028
title: Split savings rate metrics
status: done
type: bug
priority: P1
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Ribbon shows three distinct metrics: 401k deferral rate, cash surplus rate, total savings rate
  - Each metric has tooltip with numerator/denominator per metrics-definitions.md
  - Audit snapshot exports all three values for narrative layer
  - Golden fixtures updated; no single "savings rate" conflates deferral with residual cash
---

# T028 - Split Savings Rate Metrics

## Description

Players see one "savings rate" that blends 401k deferral, HYSA transfers, and leftover cash. Split into three labeled metrics so CA engineer scenarios no longer show implausible 50%+ rates.

## Scope

- `packages/ledger/src/metrics.ts`
- `apps/web/src/lib/play-session.ts` ribbon
- `docs/schema/metrics-definitions.md`

## Grill me

- Should cash surplus rate exclude intentional HYSA transfers, or count them as savings?
- Display all three on the ribbon, or show total with expandable breakdown?
- Rename "cash surplus rate" to "discretionary savings rate" for player clarity?
