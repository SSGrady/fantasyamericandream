---
id: T093
title: Panel-based stage navigation
status: done
type: feature
priority: P1
epic: E013
sprint: S016
depends_on:
  - T090
  - T089
acceptance:
  - Four panels: Briefing, Plan, Live, Close; only one active; transitions animated within shell
  - Stage indicator shows progress (not 8-step breadcrumb)
  - Forward navigation gated by XState (cannot skip to Close without sim complete)
  - Back navigation rules documented and enforced
---

# T093 - Panel-Based Stage Navigation

## Description

Replace full-page route changes with in-shell panel transitions for Briefing → Plan → Live → Close.

## Scope

- ChapterShell stage router
- XState-driven panel visibility

## Grill me

- Horizontal stepper vs vertical timeline for stage indicator?
- Allow peek at Close tabs grayed out before sim done?
- Browser back button maps to previous stage or exits chapter?
