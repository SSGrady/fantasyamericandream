---
id: T003
title: Monthly payroll & tax postings
status: done
type: feature
priority: P1
epic: E001
sprint: S001
depends_on: [T002]
acceptance:
  - grossToNet stub with federal withholding and FICA
  - 401k deferral posts to account with limit tracking
  - Student loan minimum payment posts interest then principal
  - Rent and CC interest accrue monthly
---

# T003 - Monthly Payroll & Tax Postings

## Description

First real monthly tick: income in, taxes out, retirement deferral, rent, debt service.

## Notes

Start with single W2, no state tax (add FL/TX/WA/TN zero-tax in same ticket or T005).

## Completion Notes

Completed 2026-07-19. Added `payroll.ts` (grossToNet stub with federal withholding and FICA, 401k deferral capped to IRS limit), `monthly-tick.ts` (rent, CC interest accrual, student loan minimum payment with interest-first allocation), 401k contribution tracking in apply-transaction, golden fixture `monthly-tick-jan.json`, and Vitest coverage.
