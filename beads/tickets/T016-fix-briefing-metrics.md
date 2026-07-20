---
id: T016
title: Fix briefing metrics definitions
status: done
type: bug
priority: P1
epic: E002
sprint: S005
depends_on: []
acceptance:
  - Savings rate uses (401k + HSA + brokerage + Roth + HYSA transfers) / net pay, not residual/gross
  - Take-home label documents formula (net pay after 401k deferral, before discretionary)
  - Housing burden uses rent share / net pay, not pre-401k pseudo take-home
  - DTI uses realistic debt service (minimum payments / net pay or gross per metrics doc)
  - docs/schema/metrics-definitions.md added with canonical formulas
  - Ribbon metrics and audit snapshot aligned
---

# T016 - Fix Briefing Metrics Definitions

## Description

User reported savings rate ~52% in CA is misleading: current `computeSavingsRate` treats gross minus taxes/rent/debt as "savings" (residual/gross), not intentional contributions over net pay.

## Scope

- `packages/ledger/src/audit.ts` - `computeSavingsRate`, waterfall labels
- `apps/web/src/lib/play-session.ts` - `computeRibbonMetrics` (take-home, housing burden, DTI)
- `docs/schema/metrics-definitions.md` - canonical definitions
- Golden fixtures may need updated expected values

## Notes

See [housing-rent-system.md](../../docs/specifications/housing-rent-system.md) Phase V1.1.

## Completion

2026-07-19: Added `docs/schema/metrics-definitions.md`, `packages/ledger/src/metrics.ts`, `periodNetPayCents` on `AuditSnapshot`, fixed savings rate / ribbon DTI and housing burden. Golden fixture updated.

2026-07-19 (T016b): Savings rate was still inflated (~31%) because `computeSavingsInflows` counted investment returns on brokerage/Roth/401(k) as savings. Fixed to count payroll deferrals and transfer deposits only. Waterfall now splits net pay vs deferrals; investment returns post under `growth`. Analysis page uses `computeMetricBreakdown` aligned with metrics doc.
