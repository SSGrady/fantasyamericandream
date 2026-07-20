---
id: T035
title: Choice vs luck attribution
status: done
type: feature
priority: P1
epic: E004
sprint: S007
depends_on:
  - T029
acceptance:
  - Audit shows six-month net-worth change decomposed into player choices, lifestyle leakage, macro/market luck
  - Same-seed replay with different commands shifts choice bucket, not luck bucket
  - Final report section preserves attribution for end-game scoring
  - docs/schema/metrics-definitions.md documents attribution formulas
---

# T035 - Choice vs Luck Attribution

## Description

Teach judgment under uncertainty by separating what the player controlled from macro surprises. Builds on T029 contribution vs return split.

## Scope

- Ledger audit attribution module
- Audit UI section
- End-game report

## Grill me

- Define "luck" as macro regime draw only, or include layoff timing and offer arrival?
- Show attribution as dollars, percentages, or both?
- Penalize bad luck in scoring, or score decision quality independent of luck?
