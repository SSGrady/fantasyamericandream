---
id: T091
title: Sticky life rail
status: done
type: feature
priority: P1
epic: E013
sprint: S016
depends_on:
  - T090
  - T087
acceptance:
  - Life rail visible all chapter stages: job title, liquid runway, weekly capacity, active goals, open threads
  - Values from selectors; updates on plan commit and month advance
  - Collapses gracefully on narrow viewports
  - Open threads link to interrupt or pending decision
---

# T091 - Sticky Life Rail

## Description

Persistent sticky rail anchors chapter context: current job, runway months, capacity bar, life goals, and open narrative threads (RTO pending, etc.).

## Scope

- Chapter shell layout component
- LifeRail presentational component

## Feedback

Player lost context switching between eight pages; rail restores continuity.

## Grill me

- Rail left column vs top bar on mobile?
- Show partner slot when single player (hidden vs placeholder)?
- Animate runway change on month advance?
