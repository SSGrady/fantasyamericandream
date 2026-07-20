# ADR 014: Chapter Shell and Chronology

## Status

Proposed

## Date

2026-07-20

## Context

V1.5 playthrough feedback: the loop still felt like "financial documents workflow." Opening briefing showed Jul 31 close results before planning; counterfactual inferred offers from UI state; metrics drifted across pages. V1.6 Continuity Pass fixes trust (P0) before chapter shell UX (P1+).

## Decision

### Chronology invariant

```
openingBriefing (Jan 1 start state)
  → planning (Feb–Jul policy)
  → simulating (six-month tick)
  → chapterClose (Jul 31 audit + tabs)
```

Never offer planning for a period that is `in_progress` or `closed`. Opening briefing never runs simulation on load.

### ChapterPeriod lifecycle

```typescript
interface ChapterPeriod {
  openingDate: IsoDate;   // period start anchor (e.g. 2026-01-01)
  closingDate: IsoDate;   // period end anchor (e.g. 2026-07-31)
  status: 'planned' | 'in_progress' | 'closed';
}
```

| Status | Allowed routes |
|--------|----------------|
| planned | opening briefing, planning, decide |
| in_progress | processing only |
| closed | analysis, reactions, counterfactual, audit, dashboard |

### RunState and selectors

Single authoritative `RunState` blob replaces scattered session keys. UI reads metrics only through pure selectors:

- `selectNetWorth`
- `selectLiquidRunway`
- `selectContributionProgress`
- `selectChoiceAttribution`

### Four-stage chapter shell (P1)

Persistent route `/play/chapter/:n` with panel state:

```
openingBriefing | planning | simulating | chapterClose
```

Chapter Close merges analysis, reactions, counterfactual, audit into tabbed panels: Story | Money | What If | Voices | Lesson.

### Identity invariants

- `acceptedOfferId` written at offer acceptance; immutable except explicit interrupt path
- Counterfactual reads stored id, never infers from career title or card index
- Zero-preview gate blocks silent flat impact previews

## Consequences

- S015 ships chronology, RunState, selectors, attribution tests before S016 shell routes
- ADR-013 seven-route pipeline remains until S016 migrates to chapter shell
- Dexie persistence targets RunState blob (extends T076)

## Related

- [ADR 013](./013-chapter-workflow.md)
- [E012](../../beads/epics/E012-trust-data-integrity-v16.md)
- [E013](../../beads/epics/E013-persistent-chapter-shell.md)
