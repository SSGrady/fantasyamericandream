---
id: E004
title: Trust and Metric Integrity
status: open
priority: P1
sprints:
  - S007
---

# E004 - Trust and Metric Integrity (P0)

## Goal

Restore player trust in numbers before expanding the game loop. Fix misleading metrics, incoherent housing data, and screens that repeat audits instead of evaluating player choices.

## Success Criteria

- [ ] Savings rate split: 401k deferral, cash surplus, total savings (separate ribbon metrics)
- [ ] Net-worth attribution separates contributions vs market returns vs lifestyle leakage
- [ ] Partner reactions suppressed or replaced when player is single
- [ ] Remove "Period 1 of 4" lifetime framing; use chapter or calendar language
- [ ] Rental listings coherent with metro/COL calibration and player share
- [ ] DreamHome buckets: plausible now, 1-3yr, stretch, dream (not flat affordability)
- [ ] Impact page evaluates submitted action against baseline, not audit repeat
- [ ] Six-month change attribution: choice vs luck breakdown on audit

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S007](../sprints/S007-trust-metric-fixes/sprint.md) | P0 trust and metric fixes | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T028](../tickets/T028-split-savings-rate-metrics.md) | Split savings rate metrics | open |
| [T029](../tickets/T029-contribution-vs-return-attribution.md) | Contribution vs return attribution | open |
| [T030](../tickets/T030-single-player-reactions.md) | Single-player reaction gating | open |
| [T031](../tickets/T031-chapter-framing-not-periods.md) | Chapter framing replaces period count | open |
| [T032](../tickets/T032-coherent-rental-data.md) | Coherent rental data pipeline | open |
| [T033](../tickets/T033-dreamhome-bucket-diversity.md) | DreamHome bucket diversity | open |
| [T034](../tickets/T034-impact-evaluates-submitted-action.md) | Impact evaluates submitted action | open |
| [T035](../tickets/T035-choice-vs-luck-attribution.md) | Choice vs luck attribution | open |

## Related

- [E002](./E002-v1-playable-game.md) - V1 baseline (complete)
- [E005](./E005-action-command-system.md) - blocked until trust fixes land
- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
