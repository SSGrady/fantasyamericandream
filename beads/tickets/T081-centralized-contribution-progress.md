---
id: T081
title: Centralized contribution progress
status: open
type: task
priority: P0
epic: E012
sprint: S015
depends_on:
  - T087
acceptance:
  - Single selectContributionProgress(runState) used by audit, dashboard, briefing, DreamHome
  - Per-page recalculation removed from play route components
  - IRS limit progress matches ledger YTD postings for 401k and Roth
  - Unit test: selector output stable across memoized renders
---

# T081 - Centralized Contribution Progress Selector

## Description

401k and Roth progress bars differed between audit, dashboard, and briefing due to per-page math. Centralize in selector layer (T087 dependency can land same sprint in parallel after T086).

## Scope

- `packages/domain` or `packages/shared` selectors
- Audit ribbon, dashboard skill tree, briefing metrics

## Feedback

Contribution progress recalculated differently on each page.

## Grill me

- Include employer match in progress numerator, or employee deferral only?
- Show combined retirement progress bar, or separate per account?
- Cache selector output in RunState snapshot, or compute on read only?
