---
id: T049
title: Monte Carlo package scaffold
status: done
type: feature
priority: P1
epic: E007
sprint: S010
depends_on:
  - T029
acceptance:
  - packages/monte-carlo (or agreed name) with Vitest and typecheck wired in monorepo
  - Public API: runForecast(seed, state, paths, horizonMonths)
  - Read-only: accepts PlayerState snapshot, returns distribution stats
  - No ledger mutation; documented in ADR or package README
---

# T049 - Monte Carlo Package Scaffold

## Description

New package for stochastic forecasting separate from deterministic ledger replay.

## Scope

- `packages/monte-carlo/`
- Root workspace config

## Grill me

- Package name `monte-carlo` vs `forecast-engine` vs nested under sim-engine?
- Reuse sim-engine event draws, or simplified independent model for speed?
- Default path count 500, 1000, or adaptive by device?
