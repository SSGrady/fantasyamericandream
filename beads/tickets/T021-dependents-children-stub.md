---
id: T021
title: Dependents / children stub
status: done
type: feature
priority: P2
epic: E003
sprint: S006
depends_on: [T020]
acceptance:
  - dependentsCount on HouseholdState wired from character creator
  - Childcare cost band stub in monthly expenses
  - 529 account bucket stub (no contributions yet)
  - Parental leave event stub in event schema
---

# T021 - Dependents / Children Stub

## Description

Stub dependents count and baseline childcare expense bands. Full fertility/parental leave flows deferred.

## Notes

See feature-set H (Children, childcare, 529).

## Completion (2026-07-19)

- `dependentsCount` wired from character creator (0-3) when married/partnered or single with children planned
- Monthly tick posts `expense:childcare` at $800/mo per dependent
- `Accounts.plan529` stub bucket in build-game-state
- `parental_leave_stub` event in V1 expansion registry
- Vitest: `packages/ledger/src/__tests__/childcare-dependents.test.ts`
- Docs: `docs/schema/state-model.md`, `docs/schema/event-schema.md`
