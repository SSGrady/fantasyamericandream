---
id: T050
title: Forecast Web Worker + Comlink
status: open
type: feature
priority: P1
epic: E007
sprint: S010
depends_on:
  - T049
acceptance:
  - Web Worker loads monte-carlo bundle via Comlink proxy
  - Main thread UI stays responsive during 500+ path runs
  - Progress callback or cancel token supported
  - Fallback to main-thread dev mode for tests
---

# T050 - Forecast Web Worker + Comlink

## Description

Offload Monte Carlo to worker so fan charts do not block UI.

## Scope

- `apps/web/src/workers/forecast.worker.ts`
- Comlink types

## Grill me

- Share worker with future WebLLM worker, or separate workers always?
- Transfer PlayerState via structured clone or compact binary snapshot?
- Timeout and retry policy when worker hangs?
