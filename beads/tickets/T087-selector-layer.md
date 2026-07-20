---
id: T087
title: Selector layer
status: done
type: feature
priority: P1
epic: E020
sprint: S016
depends_on:
  - T086
acceptance:
  - selectNetWorth, selectLiquidRunway, selectSavingsRate, selectContributionProgress exported
  - Pure functions; no React hooks in selector module
  - Memoization pattern documented for web app consumers
  - Unit tests per selector with golden RunState fixtures
---

# T087 - Selector Layer

## Description

Memoized selector layer over RunState for all financial metrics displayed in play UI. Eliminates per-page recalculation drift (T081, T085).

## Scope

- `packages/domain/src/selectors/` or equivalent
- Web app hook wrappers optional

## Grill me

- Zustand-style subscriptions, or React useMemo over RunState?
- Selectors call ledger helpers, or read precomputed audit snapshot only?
- Include narrative-safe formatted strings in selectors, or cents only?
