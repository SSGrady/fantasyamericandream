---
id: T074
title: ADR package restructure
status: open
type: adr
priority: P1
epic: E011
sprint: S014
depends_on:
  - T036
acceptance:
  - ADR documents target layout: domain/, engine/, monte-carlo/, events/, learning/
  - Migration phases: what moves when, without breaking existing imports
  - Public API boundaries per package listed
  - README index updated
---

# T074 - ADR Package Restructure

## Description

Plan monorepo evolution for game loop without big-bang rewrite.

## Scope

- New ADR
- PLAN.md package build order update

## Grill me

- New packages vs folders under packages/sim-engine?
- Keep ledger package name, or rename to engine/ledger?
- Breaking change allowed in V1.5, or re-export shims for all moves?
