# ADR 011: Action Command System

## Status

Accepted

## Date

2026-07-20

## Context

V1.5 requires persistent player intentions that survive monthly ticks within a chapter. Arbitrary UI mutations break replay trust. ADR-010 defines the consequence pipeline; E005 implements the command vocabulary.

## Decision

Introduce **ActionCommand** as typed, serializable player intentions:

1. Commands are **proposals** validated by sim-engine; ledger applies only resulting transaction deltas.
2. **Active command set** lives on `GameState.commandState.activeCommands` with `commandSchemaVersion` for replay.
3. **Flat command list** with **weekly capacity hours** (default 14). Passive finance knobs (401k deferral rate) cost zero capacity.
4. Commands apply at the **start of each monthly tick** within a chapter; mid-chapter replace/cancel is deterministic (last write wins per command type).
5. **Interrupt events** do not auto-pause commands in V1; narrative may warn only.
6. Command schema versions independently of `simulationVersion`.

## Consequences

- Decision Day submits a command set; processing/tick API passes `activeCommands` through sim-engine.
- Impact preview (T034) evaluates deferral and transfer commands via the same resolution path.
- Dexie persistence (E011) stores `commandState` with run snapshots.

## Alternatives Considered

- **One command per category** - rejected; capacity meter is simpler for players.
- **Session-only commands until Dexie** - rejected; replay requires run-attached state now.

## Related

- [ADR 010](./010-game-loop-and-consequence-pipeline.md)
- [E005](../../beads/epics/E005-action-command-system.md)
- [action-command schema](../schema/action-command.md)
