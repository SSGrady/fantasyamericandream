---
id: T080
title: acceptedOfferId persistence
status: done
type: bug
priority: P0
epic: E012
sprint: S015
depends_on:
  - T086
acceptance:
  - acceptedOfferId written once at offer acceptance; immutable thereafter
  - Counterfactual branch reads stored acceptedOfferId, not UI-selected or inferred offer
  - CareerState payroll uses accepted offer compensation through chapter
  - Regression test: counterfactual delta changes when acceptedOfferId changes, not when UI highlight changes
---

# T080 - acceptedOfferId Persistence

## Description

Counterfactual comparison used inferred or UI-highlighted offer instead of persisted `acceptedOfferId`. Store offer choice in RunState/DecisionRecord at acceptance; all downstream sims and previews read canonical id.

## Scope

- RunState career fields
- Planning offer acceptance handler
- Counterfactual API branch selection
- `/play/counterfactual` display

## Feedback

Job-offer identity propagation broken; counterfactual showed wrong branch.

## Grill me

- Store full offer snapshot at acceptance, or only offerId with lookup from chapter content?
- Allow offer change only via explicit interrupt (competing offer), not plan revisit?
- Migrate existing Dexie sessions without acceptedOfferId?
