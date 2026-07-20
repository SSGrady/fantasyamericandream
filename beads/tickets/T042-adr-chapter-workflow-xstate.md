---
id: T042
title: ADR chapter workflow + XState
status: done
type: adr
priority: P1
epic: E006
sprint: S009
depends_on:
  - T036
acceptance:
  - ADR documents chapter phases and transitions (briefing → ... → dashboard)
  - Interrupt events as nested or parallel XState regions defined
  - Package placement decision recorded (apps/web vs packages/domain)
  - Linked from ADR-010 and E006
---

# T042 - ADR Chapter Workflow + XState

## Description

Formalize chapter state machine before implementing CA engineer slice.

## Scope

- New or extended ADR
- Diagram in `docs/design/`

## Grill me

- XState in apps/web only, or packages/domain for testability?
- One machine per chapter template, or one global play machine with chapter context?
- Persist machine snapshot to Dexie on every transition or on phase boundaries only?
