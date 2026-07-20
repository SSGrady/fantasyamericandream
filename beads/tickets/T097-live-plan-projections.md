---
id: T097
title: Live plan projections
status: done
type: feature
priority: P2
epic: E014
sprint: S017
depends_on:
  - T094
  - T095
acceptance:
  - Editing any policy updates runway, savings rate, and NW projection within 300ms debounce
  - Uses impact API or lightweight client estimate documented
  - Projection panel visible beside controls in Plan stage
  - Does not mutate ledger until Commit
---

# T097 - Live Plan Projections

## Description

Live financial projections as player adjusts money and time policies before commit.

## Feedback

No feedback loop while editing plan; player commits blind.

## Grill me

- Full six-month sim on debounce, or analytic approximation?
- Show confidence band on projections?
- Reuse Monte Carlo worker or sync tick only?
