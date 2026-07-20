---
id: T058
title: Editorial headlines and timeline
status: done
type: feature
priority: P2
epic: E008
sprint: S011
depends_on:
  - T056
  - T057
acceptance:
  - Consequence screen shows generated headline summarizing six-month arc
  - Month-by-month timeline with key events and ledger milestones
  - Headlines from template + structured data (not LLM required)
  - Timeline scrollable on mobile
---

# T058 - Editorial Headlines and Timeline

## Description

Turn audit rows into a readable story spine on the consequence screen.

## Scope

- Consequence phase UI
- Template helpers in narrative package

## Grill me

- One headline per chapter, or headline + subhead per month?
- Timeline shows all transactions, or top 5 events only?
- Headline tone: neutral newsroom vs second-person "You survived"?
