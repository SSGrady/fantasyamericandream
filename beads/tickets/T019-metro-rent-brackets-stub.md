---
id: T019
title: Metro rent brackets (future stub)
status: open
type: spike
priority: P3
epic: E002
sprint: S005
depends_on: [T018]
acceptance:
  - Top 25 GDP metros documented with ZORI-style monthly rent anchors
  - Schema for metroId to rent multiplier vs state baseline
  - ADR stub for metro depth (defer full UI to post-V2)
  - Units verified (monthly USD, not thousands index)
---

# T019 - Metro Rent Brackets (Future Stub)

## Description

Document metro-level rent anchors for top 25 GDP metros. User-provided values (e.g. NY $2442.50/mo, LA $1354.70/mo) appear to be monthly USD rent indices, not thousands. Define `metroId -> multiplier vs state baseline` schema for future V2+ depth.

## Scope

- `docs/specifications/housing-rent-system.md` - metro anchor table
- `docs/adr/NNN-metro-rent-multipliers.md` - stub ADR
- `packages/data/src/calibration/housing/metros.json` - schema only or placeholder

## Notes

Full metro picker UI deferred post-V2. Phase V2 in spec.
