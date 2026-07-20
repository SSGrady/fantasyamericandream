---
id: T089
title: XState chapter flow update
status: done
type: feature
priority: P1
epic: E020
sprint: S016
depends_on:
  - T086
  - T090
acceptance:
  - Machine phases: openingBriefing, planning, simulating, interrupt, chapterClose
  - Replaces serial briefing/planning/processing/analysis/reactions/counterfactual/audit routes as primary flow
  - INTERRUPT transitions from simulating to planning; RESUME returns with DecisionRecord entry
  - Unit tests for happy path and RTO interrupt path
---

# T089 - XState Chapter Flow Update

## Description

Update `@fad/domain` chapter machine from ADR-013 seven-route pipeline to four-stage chapter shell flow per ADR-014.

## Scope

- `packages/domain` chapter machine
- `chapterPhaseRoute()` helper deprecation path

## Grill me

- Keep legacy routes as redirects during migration?
- chapterClose sub-states for tabs (story, money, whatIf, voices, lesson)?
- Persist machine snapshot on every transition, or phase boundaries only?
