# ADR 004: Gameplay Pacing - Monthly Accounting, Six-Month Turns

## Status

Accepted

## Date

2026-07-19

## Context

A 40-year career simulated month-by-month at the UI layer exhausts players. Annual turns hide payroll, interest accrual, and unemployment duration mechanics important for teaching (e.g., 27-week long-term unemployment threshold).

Fantasy President uses monthly federal briefings because a presidential term is 48 months. A personal finance life sim spanning decades needs coarser player pacing with finer engine granularity.

## Decision

- **Engine:** ticks **monthly** - payroll, bills, investment returns, debt interest, unemployment clock, event cooldowns
- **Player UI:** interacts every **six months** - net-worth audit, decision day, literacy challenges
- **Interrupt events:** layoffs, medical emergencies, offer deadlines, lease renewals may surface mid-cycle modal decisions without changing monthly accounting

### Six-month episode structure

1. **Briefing** - what happened (salary, rent, market, debt, relationship, upcoming)
2. **Decision day** - required, opportunity, and open-ended actions
3. **Impact analysis** - immediate + 1yr + 10yr projections, "show the math"
4. **Reactions** - partner, future self, recruiter, lender, planner perspectives
5. **Audit** - balance sheet, cash-flow waterfall, literacy progress, Monte Carlo band
6. **Next cycle setup** - allocation changes, goals, job search intensity

### Unemployment

At **27 weeks** unemployed (BLS long-term threshold), enter **Financial Emergency Mode**:

- COBRA / marketplace decisions
- Hardship options, gig work, family support
- Housing downgrade pressure
- Not automatic game over - teaching opportunity

Game over via insolvency, bankruptcy, or player exit after sustained failure.

## Consequences

- `sim-engine` exposes `tickMonth()` and `buildHalfYearAudit()` separately from player decision processing.
- Event definitions include `interruptsHalfYearPacing: boolean`.
- Quiet periods (no crisis) are valid - six months of stability enables planning.

## Alternatives Considered

- **Monthly player turns** - rejected for 40-year horizon.
- **Annual player turns** - rejected; hides unemployment and compounding lesson timing.
