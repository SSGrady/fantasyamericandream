---
id: T085
title: Cross-page value consistency
status: open
type: bug
priority: P0
epic: E012
sprint: S015
depends_on:
  - T081
  - T087
acceptance:
  - Net worth, runway, savings rate, and contribution progress identical on impact, reactions, audit, dashboard
  - Single RunState snapshot read per render via selectors
  - Integration test loads all four surfaces from same fixture; asserts metric parity
  - Document canonical metric source in metrics-definitions.md
---

# T085 - Cross-Page Value Consistency

## Description

Impact, reactions, audit, and dashboard showed divergent net worth and runway during same chapter close. All surfaces must read canonical selectors from one RunState snapshot.

## Scope

- `/play/analysis`, `/play/reactions`, `/play/audit`, `/play/dashboard`
- Future Chapter Close tabs (prep for T092)

## Feedback

Cross-page value inconsistency was top trust breaker in AI review session.

## Grill me

- Snapshot at chapter close only, or live updates during sim?
- Show stale badge if client RunState older than server tick?
- One integration test file or per-route metric assertions?
