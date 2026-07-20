---
id: T015
title: DreamHome lite
status: done
type: feature
priority: P1
epic: E002
sprint: S004
depends_on: [T011]
acceptance:
  - /play/dream-home route after audit every six months
  - 10 synthetic listings from player state and income
  - Five affordability gates with PITI, cash to close, pass/fail
  - Guardrails mode blocks severely unaffordable purchases
---

# T015 - DreamHome Lite

## Description

Synthetic home listings window shown after each net-worth audit. Calibrated from state preference and income with five affordability gates per consequence-pipeline design.

## Completion (2026-07-19)

- `/play/dream-home` route with `ListingCard` and `AffordabilityGates` components.
- `dream-home.ts` generates 10 seeded listings from state median and income.
- Five gates: cash to close, liquidity, 28/36, stress test, life fit.
- Guardrails mode (hints enabled) blocks save when critical gates fail.
