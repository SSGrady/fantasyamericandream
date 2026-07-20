# Event Schema

Every life event is defined before narrative copy exists.

## EventDefinition

```yaml
id: layoff_sector_tech
title: Company RIF Announcement
category: career
eligibility:
  minTenureMonths: 6
  sectors: [tech]
  employmentType: w2
baseProbabilityPerMonth: 0.008
modifiers:
  macroRegime:
    recession: 2.5
    expansion: 0.8
  difficulty:
    hard: 1.3
severity:
  distribution: weighted
  outcomes:
    - id: mild
      weight: 0.3
      salaryResetPct: 0
    - id: severe
      weight: 0.7
      salaryResetPct: 0.15
interruptsHalfYearPacing: true
choices:
  - id: negotiate_severance
    label: Negotiate severance package
    requiresLiteracy: []
  - id: start_job_search
    label: Begin aggressive job search
cooldownMonths: 12
calibration:
  source: BLS JOLTS layoffs rate 2026
  confidence: medium
```

## Categories

`career` · `housing` · `health` · `relationship` · `children` · `transportation` · `insurance` · `taxes` · `investing` · `consumer` · `hazard` · `fraud` · `education` · `family` · `legal` · `opportunity` · `quiet`

## ResolvedEvent (runtime)

```typescript
interface ResolvedEvent {
  definitionId: string;
  month: IsoDate;
  severityId: string;
  narrativeVariantId: string;
  ledgerEffects: LedgerTransaction[];
  followUps: string[];  // event IDs queued
}
```

## V0 Starter Events (20)

1. `quiet_month` - no crisis
2. `rent_increase`
3. `student_loan_grace_ends`
4. `open_enrollment`
5. `401k_match_available`
6. `delivery_habit_drain`
7. `layoff_warning`
8. `layoff_executed`
9. `job_offer`
10. `ghost_job_loop`
11. `medical_er_visit`
12. `car_repair`
13. `bonus_paid`
14. `market_drawdown_mild`
15. `market_rally`
16. `credit_limit_increase_offer`
17. `subscription_creep`
18. `roommate_opportunity`
19. `certification_opportunity`
20. `promotion_review`

Implementations live in `packages/sim-engine/src/events/definitions/`. TypeScript types in `packages/shared/src/types/event-definition.ts`. Registry: `packages/sim-engine/src/events/registry.ts`.
