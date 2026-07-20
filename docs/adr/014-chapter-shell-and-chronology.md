# ADR 014: Chapter Shell and Chronology

## Status

Proposed

## Date

2026-07-20

## Context

V1.5 shipped the consequence pipeline (ADR-010, ADR-013) across eight serial play routes. AI playthrough review (T078 batch) verdict: materially better than V1, but still feels like a **financial documents workflow**, not living through a chapter.

Primary gaps:

1. **Chronology** - Opening briefing Jan 1 vs chapter close Jul 31; planning available after simulation.
2. **Identity** - Counterfactual branches infer offer from UI instead of persisted `acceptedOfferId`.
3. **Continuity** - Eight full-page routes (briefing, planning, processing, analysis, reactions, counterfactual, audit, dashboard) break narrative flow.
4. **Interaction density** - Planning is static forms; simulation is batch Processing; interrupts sit on Decision Day instead of the timeline.

## Decision

Adopt a **persistent chapter shell** and strict **period lifecycle** as the V1.6 (Continuity Pass) north star.

### Route model

Single primary route:

```
/play/:runId/chapter/:chapterNumber
```

Legacy routes redirect into shell panels or serve as tab content sources during migration.

### Stage pipeline

Replace ADR-013 seven-route pipeline with four in-shell stages:

```
openingBriefing → planning → simulating (live) → chapterClose
```

| Stage | Purpose |
|-------|---------|
| openingBriefing | Stakes, calendar anchor (Jan 1), editorial hook |
| planning | Money + time policies, live projections, Commit plan CTA |
| simulating | Month rail Feb-Jul, interrupt overlays, directional previews |
| chapterClose | Tabbed merge: Story \| Money \| What If? \| Voices \| Lesson |

Interrupt handling: `simulating → planning` on INTERRUPT, DecisionRecord logged, `RESUME → simulating` through remaining months.

### ChapterPeriod lifecycle

```typescript
type ChapterPeriodStatus = 'planned' | 'in_progress' | 'closed';
```

- Plan stage blocked when status is `closed` or when sim already committed for period.
- Never plan a closed period.

### Authoritative state

- **RunState** - single client model (E020 T086)
- **Selector layer** - all surfaces read `selectNetWorth`, `selectLiquidRunway`, `selectContributionProgress`, etc. (T087)
- **DecisionRecord** - append-only log for offer acceptance, plan commits, interrupt responses (T088)

### Sticky life rail

Persistent rail across all stages: job, runway, capacity, goals, open threads. Values from selectors only.

### Financial attribution invariant

Ending net worth delta must reconcile:

```
deltaNW = choice + market + lifestyle + events
```

Enforced by Vitest invariant (T082) and cross-page consistency (T085).

## Consequences

- Beads epics E012-E020, sprints S015-S022, tickets T079-T128.
- ADR-013 route table superseded for player-facing flow; XState machine updated (T089).
- E004/E008 work remains foundation; E012/E016 extend trust and visual semantics.
- PLAN.md V1.6 Continuity Pass section tracks delivery.

## Alternatives Considered

- **Polish existing eight routes only** - rejected; does not fix continuity or interaction density.
- **Monthly player turns** - rejected; ADR-004 six-month cadence unchanged; shell wraps the window.
- **Server-side RunState first** - rejected for V1.6; client Dexie authoritative with selector layer.

## Related

- [ADR 010](./010-game-loop-and-consequence-pipeline.md)
- [ADR 013](./013-chapter-workflow.md) - prior route model
- [E012](../../beads/epics/E012-trust-data-integrity-v16.md)
- [E013](../../beads/epics/E013-persistent-chapter-shell.md)
- [E004](../../beads/epics/E004-trust-metric-integrity.md)
- [E008](../../beads/epics/E008-consequence-theater-visual-design.md)
