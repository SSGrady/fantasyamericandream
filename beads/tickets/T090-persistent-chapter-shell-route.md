---
id: T090
title: Persistent chapter shell route
status: done
type: feature
priority: P1
epic: E013
sprint: S016
depends_on:
  - T086
  - T089
acceptance:
  - Route `/play/[runId]/chapter/[chapterNumber]` hosts full chapter UX
  - Legacy `/play/briefing` etc. redirect or embed into shell
  - RunId and chapterNumber validated; 404 on unknown run
  - Deep link restores correct stage from XState snapshot
---

# T090 - Persistent Chapter Shell Route

## Description

Single persistent route replaces eight full-page play routes. Chapter shell mounts stage panels without full navigation unmount.

## Scope

- `apps/web/src/app/play/[runId]/chapter/[chapterNumber]/`
- Layout with life rail slot

## Feedback

"Living through a chapter" requires one shell, not serial report pages.

## Grill me

- runId in URL vs session-only with opaque slug?
- Support chapter 0 onboarding preview, or create flow stays separate?
- SSR shell with client hydration for RunState, or client-only?
