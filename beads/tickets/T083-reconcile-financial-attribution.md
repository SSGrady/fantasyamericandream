---
id: T083
title: Reconcile financial attribution
status: open
type: bug
priority: P0
epic: E012
sprint: S015
depends_on: []
acceptance:
  - Audit snapshot exposes choice, market, lifestyle, and event attribution components
  - Briefing luck vs choice copy uses same components as audit waterfall
  - Lifestyle leakage includes delivery, rent share, discretionary drift
  - Components sum to period net-worth delta within documented tolerance
---

# T083 - Reconcile Financial Attribution

## Description

Implement and wire attribution decomposition so briefing, audit, and Chapter Close Money tab tell one story. Builds on T029/T035 but closes gaps found in V1.5 playthrough.

## Scope

- TurnResult / audit snapshot types
- Briefing editorial attribution
- Impact analysis delta labels

## Feedback

Attribution copy on briefing did not match audit waterfall totals.

## Grill me

- Attribute rent COL changes to lifestyle or macro bucket?
- Show event attribution as single line or per-event breakdown?
- Include unrealized vs realized gains split in market bucket?
