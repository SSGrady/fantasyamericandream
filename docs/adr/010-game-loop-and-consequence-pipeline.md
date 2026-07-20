# ADR 010: Game Loop and Consequence Pipeline

## Status

Proposed

## Date

2026-07-20

## Context

V1 shipped a working financial engine and President-simulator-style screens, but playtesting feedback describes the experience as "configure, calculate, read reports." The ledger, six-month cadence, and skill-tree philosophy are sound; the missing layer is a **consequence-driven game loop** like Fantasy President Career.

Players need to feel agency through persistent actions, chapter-shaped narratives, and forensic attribution (choice vs luck), not just audit snapshots.

## Decision

Adopt a **chapter-based consequence pipeline** as the V1.5 north star:

```
briefing → planning → simulating → consequence → counterfactual → audit → dashboard
```

### Chapter structure

- One **chapter** = one six-month player turn with optional mid-cycle interrupts.
- Chapters are authored vertical slices (first: CA software engineer) with job offers, housing stakes, and scripted surprises.
- **Action commands** persist across monthly ticks within a chapter (401k rate, job search intensity, delivery cap, relocation intent, etc.).
- **Time/energy capacity** constrains how many concurrent commands a player can maintain.

### Trust layer (P0, prerequisite)

Before expanding content, fix metric integrity:

- Split savings rate into deferral, cash surplus, and total savings.
- Attribute net-worth change to contributions vs market returns vs lifestyle leakage.
- Impact analysis must evaluate the **submitted action**, not replay the prior audit.
- Partner reactions gated when household mode is single.

### Presentation layer (P4)

Consequence theater: editorial headlines, stakeholder voices, semantic color tokens, card types (briefing, opportunity, hazard, learning), Life Compass dimensions, Decision Day command center.

### Planning layer (P3)

Monte Carlo lab in a Web Worker with fan charts, goal probabilities, and common-random-number counterfactuals. Unlocked by literacy skills; never mutates ledger state.

### Narrative layer (P5, last)

Template-first copy with deterministic fallback. Optional local LLM (WebLLM) for interpretation and reactions. All LLM output validated with Zod; **never** mutates financial state from unvalidated text.

### Workflow orchestration

XState machines manage chapter phase transitions and interrupt handling. Exact package placement (apps/web vs packages/domain) resolved in E011 architecture sprint.

## Consequences

- Beads epics E004-E011 and sprints S007-S014 track phased delivery.
- V1 remains shippable; V1.5 adds the game loop without breaking ledger determinism.
- New packages (`monte-carlo`, optional `domain/`) may be introduced per E011 ADR tickets.

## Alternatives Considered

- **More audit polish only** - rejected; does not address lack of agency.
- **LLM-first narrative before commands** - rejected; trust and action vocabulary must come first.
- **Drop six-month cadence for monthly decisions** - rejected; ADR-004 pacing stays; chapters wrap the six-month window.

## Related

- [ADR 007](./007-ui-consequence-pipeline.md) - original pipeline (superseded in spirit by this ADR for V1.5+)
- [ADR 004](./004-gameplay-pacing.md) - monthly engine, six-month player turns
- [Product thesis](../vision/product-thesis.md) - north star moment
- Beads: E004-E011, S007-S014
