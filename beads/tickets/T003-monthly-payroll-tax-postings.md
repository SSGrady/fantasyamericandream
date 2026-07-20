---
id: T003
title: Monthly payroll & tax postings
status: open
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
