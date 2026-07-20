---
id: T103
title: Commit and continue months
status: open
type: feature
priority: P2
epic: E015
sprint: S018
depends_on:
  - T101
acceptance:
  - After interrupt response, player commits and sim resumes remaining months
  - Month rail shows completed + remaining segments
  - No return to full Processing page
  - XState simulating sub-state tracks monthsCompleted
---

# T103 - Commit and Continue Remaining Months

## Description

Post-interrupt flow: commit choice, animate through remaining months, then transition to Chapter Close.

## Grill me

- Re-run full six-month sim on interrupt, or incremental from checkpoint?
- Show summary card after interrupt commit before rail resumes?
- Skip animation option always visible?
