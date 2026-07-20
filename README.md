# Life Ledger: Class of 2026

**Build a career. Survive the economy. Buy back your time.**

A personal-finance life-path simulator inspired by [fantasypresidentcareer.com](https://fantasypresidentcareer.com) - rigorous ledger accounting underneath, President-simulator-style consequence pipeline on top, financial literacy as a skill tree.

## Quick Start

```bash
pnpm install
pnpm typecheck
pnpm test
```

## Documentation

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](./AGENTS.md) | AI agent orientation |
| [PLAN.md](./PLAN.md) | Phased delivery V0→V3 |
| [docs/adr/](./docs/adr/) | Architecture decisions |
| [docs/vision/feature-set.md](./docs/vision/feature-set.md) | Exhaustive feature inventory |
| [beads/](./beads/) | Epic / sprint / ticket tracking |

## Repo Structure

```
apps/web              Next.js UI (V1)
packages/ledger       Deterministic accounting
packages/sim-engine   Stochastic life simulation
packages/narrative    Briefing & reaction copy
packages/data         Calibration loaders
packages/shared       Shared types
```

## Status

**V0 in progress** - financial engine prototype (see [E001](./beads/epics/E001-v0-financial-engine.md)).
