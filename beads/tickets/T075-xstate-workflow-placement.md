---
id: T075
title: XState workflow placement
status: open
type: spike
priority: P1
epic: E011
sprint: S014
depends_on:
  - T042
acceptance:
  - Spike compares apps/web-only vs packages/domain XState hosting
  - Decision recorded in ADR with testability and bundle size notes
  - Prototype machine loads in dev with one transition tested
  - E006 T048 unblocked with clear import path
---

# T075 - XState Workflow Placement

## Description

Resolve open question: XState in apps/web vs packages/domain?

## Scope

- Spike code or doc-only prototype
- ADR update

## Grill me

- Share machine types with server API routes, or client-only forever?
- XState inspect devtools in production builds?
- Persist meta state in URL query for shareable replay links?
