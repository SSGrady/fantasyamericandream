---
id: T065
title: Job offers not sector pick
status: done
type: feature
priority: P1
epic: E009
sprint: S012
depends_on:
  - T044
acceptance:
  - Onboarding presents 2-3 concrete job offers instead of sector dropdown alone
  - Offers include employer flavor, salary band, benefits sketch, commute hint
  - Selected offer seeds CareerState; sector derived not primary input
  - Advanced Life Setup can still override sector manually
---

# T065 - Job Offers Not Sector Pick

## Description

Replace abstract sector picker with tangible job choice at onboarding (aligned with chapter planning).

## Scope

- Character creator refactor
- Offer generation

## Grill me

- Same offer engine as chapter T044, or simplified onboarding subset?
- Fictional company names vs generic "Bay Area SaaS"?
- Guarantee one offer always viable for chosen scenario difficulty?
