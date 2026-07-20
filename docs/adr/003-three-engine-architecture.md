# ADR 003: Three-Engine Architecture

## Status

Accepted

## Date

2026-07-19

## Context

Personal finance simulation combines:

- Exact accounting (payroll, taxes, amortization, contribution limits)
- Stochastic life events (layoffs, medical bills, relationship changes)
- Human-readable explanations (briefings, stakeholder reactions)

Mixing these in one module or delegating math to an LLM creates untestable, non-reproducible outcomes.

## Decision

Split into three engines with a strict data flow:

```
┌─────────────┐     proposed deltas      ┌─────────────┐
│ sim-engine  │ ───────────────────────► │   ledger    │
│ (stochastic)│                          │(deterministic)│
└─────────────┘                          └──────┬──────┘
       │                                         │
       │ TurnResult (structured)                 │ AuditSnapshot
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│  narrative  │ ◄── TurnResult ──────────│   web/CLI   │
│   (copy)    │                          │  (present)  │
└─────────────┘                          └─────────────┘
```

### Ledger engine (`packages/ledger/`)

- Applies transactions, enforces invariants
- Payroll, tax withholding, debt amortization, investment returns posting
- Contribution limit enforcement by tax year
- **Sole authority** on account balances and net worth

### Simulation engine (`packages/sim-engine/`)

- Monthly tick orchestration
- Macro regime transitions (correlated: layoffs, returns, rates, rent)
- Event eligibility, probability, severity sampling
- Career hazard functions, job search, ghost jobs
- Outputs **proposed** ledger entries + `TurnResult` metadata - never mutates balances directly

### Narrative engine (`packages/narrative/`)

- Consumes `TurnResult`, `AuditSnapshot`, player action text
- Produces briefing headlines, reaction cards, coach notes
- LLM optional in V1+; template-based fallback required for offline/test

## Consequences

- Integration tests: `sim-engine` + `ledger` with fixed seed must match golden audit files.
- Narrative wording changes cannot alter financial outcomes (contract test).
- New features declare which engine owns the logic before implementation.

## Alternatives Considered

- **LLM-as-calculator** - rejected; violates reproducibility and auditability.
- **Single "GameEngine" class** - rejected; DPS-style separation improves testability.
