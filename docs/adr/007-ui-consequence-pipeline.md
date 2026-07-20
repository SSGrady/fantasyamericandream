# ADR 007: UI - President-Simulator Consequence Pipeline

## Status

Accepted

## Date

2026-07-19

## Context

Fantasy President Career's core UX is a repeatable sequence that makes complex policy outcomes legible. Fantasy American Dream needs an equivalent interaction grammar for financial life decisions without copying branding, assets, or prose.

## Decision

Adopt the **consequence pipeline** interaction pattern:

```
Scenario select → Character setup → Module toggles
        ↓
Six-month briefing (metrics ribbon + narrative)
        ↓
Decision day (required / opportunity / open-ended action)
        ↓
Processing state ("analyzing impact…")
        ↓
Impact analysis (fiscal + liquidity + risk + time)
        ↓
Stakeholder reactions (competing perspectives)
        ↓
Net-worth audit dashboard
        ↓
(loop or end report)
```

### Fantasy President → Fantasy American Dream mapping

| President UI | Fantasy American Dream equivalent |
|--------------|------------------------|
| Choose era/scenario | Choose financial starting life (Class of 2026, Gig Economy, etc.) |
| Character setup | Person + household + balance sheet + module toggles |
| Monthly briefing | Six-month life briefing |
| Policy text box | Career/spending/housing/family action |
| Federal agency analysis | Financial impact analysis |
| Press reaction | Partner, future self, recruiter, lender reactions |
| State approval map | COL / tax / job-market comparison map |
| Stakeholder approval | Employer, insurer, household goal effects |
| Presidential dashboard | Net-worth & resilience dashboard |
| Favours owed | Social capital / negotiation chips (V1+) |

### UI principles

- Card-based layout, light background, serif headlines for narrative moments
- Metrics ribbon at top of briefing (salary, savings rate, runway, DTI)
- "Show the math" expandable on every impact analysis
- Knowledge gates change **wording and blocking**, not random outcomes
- Open-ended action field with structured fallback suggestions

Full wireflow: [`docs/design/consequence-pipeline.md`](../design/consequence-pipeline.md)

## Consequences

- V0 may use JSON/CLI; V1 implements `apps/web` against this flow.
- React components organized by pipeline stage, not by domain entity.
- Do not copy Fantasy President visual assets or text.

## Alternatives Considered

- **Wizard-only multiple choice** - rejected; open-ended actions increase agency.
- **Spreadsheet dashboard primary** - rejected; poor narrative engagement.
