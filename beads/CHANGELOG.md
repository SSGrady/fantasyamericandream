# Beads Changelog

Aggregated progress log. Append dated entries when closing tickets.

## 2026-07-20 (continuity pass planning)

- **Planning** - V1.6 Continuity Pass beads: epics E012-E020, sprints S015-S022, tickets T079-T128 (grill-with-me). ADR-014 proposed. PLAN.md V1.6 section. Cross-links from E004, E008.

## 2026-07-20 (playthrough)

- **T078** - Playthrough feedback: impact API loop fix and server cache, CA rental realism, transportation mode and ledger-backed events, briefing editorial/luck attribution, counterfactual CRN comparison, DreamHome polish, debounced command preview.

## 2026-07-20 (continued)

- **S009 / E006** - Chapter vertical slice (T042-T048): ADR-013, CA engineer chapter, planning/counterfactual routes, interrupts, lesson unlock, XState routing.
- **S010 / E007** - Monte Carlo lab (T049-T054): `@fad/monte-carlo`, forecast API, fan chart, goal probability, CRN policy comparison, `/play/lab`.
- **S011 / E008** - Consequence theater (T055-T062): editorial design tokens, ConsequenceCard, MonthTimeline, LifeCompass, motion, dashboard polish.
- **S012 / E009** - Onboarding redesign (T063-T067): scenario tension/difficulty cards, life priorities, slim/advanced setup, module presets.
- **S013 / E010** - Local LLM narrative layer (T068-T073): template-first narrative, Zod LLM schemas, NL action interpretation, guardrails.

## 2026-07-20

- **S007 / E004** - Trust metric fixes complete (T028-T035): split savings ribbon (401k deferral, cash surplus, total), net-worth attribution (contributions vs returns vs choice/luck), chapter calendar framing, rental COL calibration unification, DreamHome aspiration buckets, impact counterfactual API, single-player reaction gating.
- **S008 / E005** - Action command foundation (T036-T041): ADR-011, ActionCommand Zod union (15 types), weekly capacity, sim scheduler, transfer postings, CommandCenter UI.
- **S014 / E011** - Platform architecture (T074-T077): ADR-012 package plan, `@fad/domain` XState chapter machine, Dexie persistence scaffold, branded financial type helpers.
- **Planning** - V1.5 game loop beads: epics E004-E011, sprints S007-S014, tickets T028-T077 (grill-with-me). ADR-010 proposed. PLAN.md V1.5 section, product thesis north star updated.
- **Rename** - Product branding updated from Life Ledger to Fantasy American Dream across UI, docs, and beads.
- **T019** - Metro rent brackets: top 25 GDP metros in `metros.ts`, ADR-009, multiplier wired into COL-tier rent sampling.
- **T023** - Term life / disability insurance premium stubs on monthly tick; module toggles gate posting.
- **T024** - Divorce toggle stub: warning and fallout events, relationshipHealth gating, `divorce-fallout.ts`.
- **T027** - Roth IRA balance breakdown footnote (starting + contributions + returns); credit card pay-in-full autopay for playbook card spend.
- **T018** - COL-tier stochastic rent ranges in `packages/data/src/calibration/housing/col-tiers.ts`; v0-rent-only and rental picker use seeded tier sampling.
- **T022** - Homeownership engine stub: `housingMode` rent/own, `MortgageDebt`, PITI monthly posting when own.

## 2026-07-19 (continued)

- **T026** - Baseline living expenses stub: health insurance, utilities, groceries, subscriptions on monthly tick; cooking/delivery modifiers; employer health plan toggle; runway and waterfall updated.
- **T026** - Starting net worth transparency: brokerage on balance sheet, no hidden V0 fixture injection, `startNetWorth` on audit snapshot, timeline baseline, rental COL-tier jitter, regression test.

- **T025** - Rental picker: `/create/rental` with synthetic listings, player rent share, draft storage, flow before briefing.
- **T016c** - Metric breakdown on audit snapshot, impact analysis math display (runway costs, savings numerator), IRS 2026 limits in UI copy.
- **T017** - Housing arrangement rent split: character creator selector, `housing-rent.ts` fractions, `LocationState.marketRentMonthly`, player share on monthly tick.
- **T016b** - Savings rate fix: exclude investment returns from numerator; split payroll waterfall; analysis metric breakdown aligned with metrics doc.
- **T021** - Dependents stub: dependentsCount, childcare expense, plan529 bucket, parental leave event, tests.
- **T016** - Briefing metrics: savings rate over net pay, periodNetPayCents on audit, metrics-definitions doc, ribbon labels.
- **S005** - V1 metrics and housing fixes sprint opened (T016-T019 planning, housing-rent-system spec).
- **E003** - V2 Household Simulator epic opened; S006 foundation sprint started.
- **T020** - Dual-income household stub: HouseholdState, partner payroll, character creator field, tests.

## 2026-07-19

- **E002** - V1 Playable Game epic complete (all four success criteria met).
- **T015** - DreamHome lite: `/play/dream-home`, 10 synthetic listings, five affordability gates, guardrails mode.
- **T014** - Skill tree v1: 10 literacy tracks on dashboard, First $100K quiz unlocks Investing I and analysis emphasis.
- **T013** - 32 event definitions, seeded event roll in tickMonthsWithSimulation, briefing event summary.
- **S004** - V1 content depth sprint complete (3/3 tickets).
- **T011** - Core play loop: sim tick API, play session, briefing through audit screens, pipeline stubs.
- **T010** - Module toggles: grouped panels on `/create/modules`, V1RunConfig types, session run config, `/play/briefing` stub.
- **T009** - Character creator: trait grids, balance sheet, session draft, `/create/modules` stub, shared V1CharacterDraft types.
- **E002** - V1 Playable Game epic opened; S003 UI shell sprint started.
- **T008** - V1 UI shell: Tailwind in apps/web, landing, `/scenarios` card list, `/create` stub, shared V1 scenario types.
- **T001** - Initial repo scaffold: AGENTS.md, ADRs 001-008, beads hierarchy, package skeleton, vision/schema docs.
- **T002** - Shared types, applyTransactions, validateInvariants, golden fixture, invariant tests 1-4.
- **T003** - Monthly payroll, grossToNet stub, 401k deferral, rent/CC interest/student loan postings, golden fixture.
- **T004** - Six-month audit tick, waterfall snapshot, contribution progress, JSON export, golden fixture.
- **T005** - Seeded sim-engine: macro regimes, layoff hazard, market returns, tickMonthsWithSimulation, determinism golden test.
- **T006** - V0 scenario matrix: 5 careers × 8 states rent-only fixtures, tickSixMonthsWithSimulation, 40-scenario Vitest matrix.
- **T007** - 20 V0 event definitions, EventDefinition types, 10 literacy skill stubs, registry and tests.
- **E001** - V0 Financial Engine Prototype epic complete (all success criteria met).
