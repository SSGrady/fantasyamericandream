---
id: T088
title: DecisionRecord event sourcing
status: done
type: feature
priority: P1
epic: E020
sprint: S016
depends_on:
  - T086
acceptance:
  - DecisionRecord append-only log for offer acceptance, plan commit, interrupt responses
  - Each record: timestamp, chapterNumber, actionType, payload hash, seed
  - Counterfactual replays from DecisionRecord, not inferred UI state
  - Replay test: same records + seed = same ledger outcome
---

# T088 - DecisionRecord Event Sourcing

## Description

Append-only DecisionRecord log for player choices enables forensic replay and fixes counterfactual identity bugs (pairs with T080).

## Scope

- RunState.decisionLog array
- Dexie persistence
- Counterfactual API input

## Grill me

- Compact hash-only records, or full command payload stored?
- Cap log length per chapter, or unbounded with export?
- Expose DecisionRecord timeline in Chapter Close Story tab?
