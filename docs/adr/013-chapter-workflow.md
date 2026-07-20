# ADR 013: Chapter Workflow and XState Orchestration

## Status

Accepted

## Date

2026-07-20

## Context

V1.5 replaces abstract six-month periods with authored chapters. ADR-010 defines the consequence pipeline; `@fad/domain` hosts the XState machine (ADR-012, T075).

## Decision

### Phase pipeline

```
briefing → planning → simulating → consequence → counterfactual → audit → dashboard
```

| Phase | Route | Purpose |
|-------|-------|---------|
| briefing | `/play/briefing` | Six-month tick + stakes copy |
| planning | `/play/planning` | Job offers, housing, commands |
| simulating | `/play/processing` | Impact/counterfactual compute |
| consequence | `/play/analysis`, `/play/reactions` | Impact cards + stakeholder voices |
| counterfactual | `/play/counterfactual` | Chosen vs alternate path |
| audit | `/play/audit` | Net-worth waterfall |
| dashboard | `/play/dashboard` | Life Compass + continue |

### Interrupt handling

Interrupt events (RTO mandate, competing offer) transition `simulating → planning` via `INTERRUPT`, then `RESUME` returns to `simulating`. Snapshot persisted on phase boundaries (Dexie).

### First authored chapter

CA software engineer, Class of 2026: three job offers, return-to-office interrupt, emergency-fund lesson unlock on thin runway.

## Consequences

- Play session stores `chapterPhase` and `chapterId`
- Machine lives in `packages/domain`; web app uses `chapterPhaseRoute()` helper
- Counterfactual uses same seed, alternate offer/deferral from authoring

## Related

- [ADR 010](./010-game-loop-and-consequence-pipeline.md)
- [ADR 012](./012-package-restructure.md)
- [E006](../../beads/epics/E006-chapter-vertical-slice.md)
