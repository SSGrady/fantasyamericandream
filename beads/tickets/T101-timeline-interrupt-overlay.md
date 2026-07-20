---
id: T101
title: Timeline interrupt overlay
status: done
type: feature
priority: P2
epic: E015
sprint: S018
depends_on:
  - T100
  - T045
acceptance:
  - Interrupt events render as overlay on month rail at authored month (e.g. RTO April)
  - Overlay blocks auto-advance until player responds
  - DecisionRecord logs interrupt response
  - Resume continues from interrupt month
---

# T101 - Timeline Interrupt Overlay

## Description

Mid-timeline interrupt UI on month rail instead of static Decision Day page.

## Feedback

RTO should appear in April on timeline, not as abstract Decision Day.

## Grill me

- Modal overlay vs inline rail expansion?
- Allow defer interrupt one month (risk penalty)?
- Show preview of commute cost before RTO choice?
