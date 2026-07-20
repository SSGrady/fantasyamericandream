---
id: T048
title: XState chapter machine
status: open
type: feature
priority: P1
epic: E006
sprint: S009
depends_on:
  - T042
  - T075
acceptance:
  - XState machine implements ADR chapter phases
  - Play routes driven by machine state, not ad hoc redirects
  - Machine serializable for Dexie persistence
  - Unit tests for happy path and interrupt path transitions
---

# T048 - XState Chapter Machine

## Description

Implement orchestration for briefing → planning → simulating → consequence → counterfactual → audit → dashboard.

## Scope

- XState machine module (placement per T075)
- Play layout integration

## Grill me

- XState v5 in apps/web, or shared package re-export?
- URL reflects machine state (/play/planning) or opaque session phase?
- Back button rewinds machine, or disabled during chapter?
