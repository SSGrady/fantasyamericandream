# ADR 001: Project Vision and Phased Delivery

## Status

Accepted

## Date

2026-07-19

## Context

Millennial and Gen Z workers entering the workforce in 2026 face a structurally different labor market than prior cohorts: post-pandemic layoff cycles, salary resets after displacement, elevated mortgage rates, insurance complexity, and lifestyle habits (delivery spending, subscription load) that erode early savings.

Existing tools split into budgeting apps (transaction tracking without narrative consequence), FIRE calculators (single-path deterministic math), and trivia quizzes (memorization without judgment). None combine immersive life-path choices, Monte Carlo uncertainty, and teachable financial literacy in a replayable RPG loop.

Fantasy President Career demonstrates that a **consequence pipeline** - briefing, player action, analytical report, human reactions, updated dashboard - makes complex systems emotionally memorable. Fantasy American Dream applies that grammar to personal finance.

## Decision

Build **Fantasy American Dream: Class of 2026** as a life-path simulator with three foundational principles:

1. **Ledger truth** - All money is computed deterministically; randomness affects events, not arithmetic integrity.
2. **Knowledge as skill tree** - Quizzes unlock analysis (affordability gates, fee warnings, Monte Carlo). They do not increase market returns.
3. **Tradeoffs, not cheapest-wins** - Decisions balance resilience, time, relationships, and optionality. Multiple paths can be defensible.

### Phased delivery

| Phase | Name | Focus |
|-------|------|-------|
| V0 | Financial engine prototype | Monthly ledger, 6-month audit, layoff + market, seeded replay |
| V1 | Playable game | President-simulator UI, character creator, scenarios, skill tree, DreamHome lite |
| V2 | Household simulator | Partner, children, homeownership, insurance depth, relocation |
| V3 | Platform | 50-state, classroom, shareable seeds, analytics |

V0 must be useful without polished UI - a CLI or JSON audit proves the engine.

### End conditions

Simulation ends when:

- Player reaches age 65
- Player achieves Coast FIRE and opts out
- Player chooses "End simulation and see results"
- Insolvency / bankruptcy (after Emergency Mode exhausted)
- Long-term unemployment without recovery path (configurable strictness)

### Success metrics (product)

- Decision-quality score separable from luck score on final report
- Replay with same seed shows counterfactual paths
- Measurable literacy unlock usage before major decisions (e.g., housing gates)

## Consequences

- Feature work must trace to a phase gate in `PLAN.md` and a beads epic.
- V1 UI must not ship before V0 ledger invariants pass tests.
- Durable product decisions live in ADRs; beads tickets freeze at close.

## Alternatives Considered

- **Budgeting app with random events** - rejected; lacks narrative depth and skill progression.
- **Spreadsheet-first simulator** - rejected; poor teaching UX for target audience.
- **Build full lifetime simulator first** - rejected; buries accounting validation under UI scope.
