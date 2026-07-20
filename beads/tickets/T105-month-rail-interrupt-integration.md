---
id: T105
title: Month rail interrupt integration
status: done
type: feature
priority: P2
epic: E015
sprint: S018
depends_on:
  - T100
  - T101
  - T103
acceptance:
  - End-to-end CA chapter: plan commit → rail Feb-Jul → RTO overlay April → resume → Close
  - Integration test or Playwright stub covers interrupt path
  - Life rail open threads clear after interrupt resolved
  - No legacy Decision Day route in happy path
---

# T105 - Month Rail Interrupt Integration

## Description

Capstone integration ticket wiring month rail, interrupt overlay, and commit-continue into one Live stage flow.

## Feedback

Key playthrough gap: interrupts during timeline, not static Decision Day.

## Grill me

- Playwright required for V1.6, or Vitest + DOM stub sufficient?
- Second interrupt in same chapter for stretch goal?
- Fallback if JS animation fails?
