---
id: E007
title: Monte Carlo Planning Lab
status: done
priority: P2
sprints:
  - S010
---

# E007 - Monte Carlo Planning Lab (P3)

## Goal

Give players a forecasting lab that visualizes uncertainty without breaking ledger determinism. Fan charts, goal probabilities, and luck-vs-decision attribution powered by a Web Worker engine.

## Success Criteria

- [ ] `packages/monte-carlo` (or equivalent) with seeded forecast runs
- [ ] Web Worker + Comlink interface from apps/web
- [ ] Fan chart visualization (visx) for net worth / runway
- [ ] Goal probability estimates (Coast FIRE, down payment, emergency fund)
- [ ] Common-random-number comparisons for counterfactual paths
- [ ] Lab read-only: never mutates PlayerState or ledger

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S010](../sprints/S010-monte-carlo-lab/sprint.md) | Monte Carlo forecast lab | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T049](../tickets/T049-monte-carlo-package-scaffold.md) | Monte Carlo package scaffold | open |
| [T050](../tickets/T050-forecast-worker-comlink.md) | Forecast Web Worker + Comlink | open |
| [T051](../tickets/T051-fan-chart-visx.md) | Fan chart visx component | open |
| [T052](../tickets/T052-goal-probability-engine.md) | Goal probability engine | open |
| [T053](../tickets/T053-crn-counterfactual-comparison.md) | CRN counterfactual comparison | open |
| [T054](../tickets/T054-lab-luck-decision-attribution.md) | Lab luck vs decision attribution | open |

## Depends On

- [E004](./E004-trust-metric-integrity.md) - attribution math must be trustworthy
- Literacy skill unlock (existing skill tree)

## Related

- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
