---
id: T126
title: Mini planning lab
status: done
type: feature
priority: P2
epic: E019
sprint: S022
depends_on:
  - T052
acceptance:
  - DreamHome lab inputs: monthly transfer, target area, down payment %, target purchase age
  - Read-only sim adjusts bucket placement and goal date
  - Does not mutate ledger; uses Monte Carlo or deterministic projection
  - Results update primary blocker messaging
---

# T126 - Mini Planning Lab

## Description

Interactive what-if lab on DreamHome page for path to target listing.

## Feedback

DreamHome read as static report; needs planning interaction.

## Grill me

- Reuse /play/lab worker, or lighter client formula?
- Skill-gate lab behind literacy unlock?
- Save lab scenario to RunState goals?
