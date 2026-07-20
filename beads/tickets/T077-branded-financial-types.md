---
id: T077
title: Branded financial types
status: open
type: feature
priority: P2
epic: E011
sprint: S014
depends_on: []
acceptance:
  - MoneyCents, BasisPoints, TaxYear branded types in packages/shared
  - Constructor/parse helpers prevent raw number confusion
  - Key ledger APIs adopt branded types without breaking external JSON (serialize as number)
  - docs/schema/state-model.md updated
---

# T077 - Branded Financial Types

## Description

Type-level safety for cents vs dollars vs basis points across ledger and UI.

## Scope

- `packages/shared/src/types/branded.ts`
- Gradual adoption in ledger

## Grill me

- Migrate all cents fields at once, or incremental hot paths?
- Runtime validation on JSON import, or compile-time only?
- Display helpers co-located (formatMoney) or separate package?
