---
id: T082
title: Attribution invariant test
status: done
type: test
priority: P0
epic: E012
sprint: S015
depends_on:
  - T083
acceptance:
  - Vitest invariant: endingNW - startingNW = choiceDelta + marketDelta + lifestyleDelta + eventDelta (within rounding)
  - Fails CI if attribution components do not sum to net-worth change
  - Golden fixture covers CA engineer chapter with known decomposition
  - Test documents rounding tolerance in cents
---

# T082 - Attribution Invariant Test

## Description

Add ledger-level test enforcing forensic attribution equation from playthrough feedback. Prevents regression where audit shows choice vs luck but components do not reconcile.

## Scope

- `packages/ledger/__tests__/` or sim-engine golden
- Audit snapshot attribution fields

## Feedback

"Ending NW = choice + market + lifestyle + events" must hold or trust collapses.

## Grill me

- Treat market as brokerage + 401k returns only, or all account appreciation?
- Bucket employer match under choice or market?
- Fail hard on 1-cent drift, or allow configurable epsilon?
