---
id: T034
title: Impact evaluates submitted action
status: open
type: bug
priority: P1
epic: E004
sprint: S007
depends_on: []
acceptance:
  - Impact analysis runs counterfactual sim with player's submitted decision applied
  - Baseline vs chosen path delta shown (runway, savings, net worth)
  - Page does not repeat prior audit snapshot as if it were impact of today's choice
  - API accepts decision payload; golden test for known delta
---

# T034 - Impact Evaluates Submitted Action

## Description

Impact page currently mirrors audit data instead of evaluating what the player just chose. Wire decision payload through tick API for before/after comparison.

## Scope

- `apps/web/src/app/play/analysis/`
- `apps/web/src/app/api/sim/tick/`
- Play session decision storage

## Grill me

- Simulate full six months for impact preview, or one-month extrapolation for speed?
- Show confidence band on impact preview before player commits?
- Block continue if impact sim fails, or fallback to qualitative copy?
