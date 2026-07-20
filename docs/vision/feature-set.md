# Feature Set - Exhaustive Inventory

Status key: `[V0]` engine prototype · `[V1]` playable · `[V2]` household · `[V3]` platform · `[?]` needs ADR/spike

---

## A. Onboarding & Character

| Feature | Status | Notes |
|---------|--------|-------|
| Scenario picker (curated lives) | [V1] | Class of 2026, Non-Target, Tech, Medical, Gig, Pivot, Young Family, Laid Off |
| Custom character creator | [V1] | Full toggle surface |
| Target vs non-target school modifier | [V0] | Recruiting friction, not permanent salary cap |
| Career sector selection | [V0] | Tech, finance, medicine, public service, … |
| Starting balance sheet | [V0] | Checking, HYSA, Roth, 401k, HSA, debts |
| Habits (delivery, subscriptions, cooking) | [V0] | Skill tree can reduce leakage |
| Module toggles ( divorce, hazards, difficulty) | [V1] | See user journey |
| New Game+ (retained player knowledge) | [V1] | No inherited wealth |
| Random seed display & replay | [V0] | |

## B. Career & Education

| Feature | Status | Notes |
|---------|--------|-------|
| Base salary, bonus, equity, RSU vesting | [V0] partial | Full equity [V1] |
| Layoff hazard by sector/tenure/macro | [V0] | BLS 1.1% monthly baseline translated to conditional hazard |
| Mass layoff events | [V1] | Difficulty-scaled |
| Job search funnel (apps → offers) | [V0] stub | |
| Ghost jobs (time sink) | [V1] | ~15–25% param range, labeled confidence |
| Salary reset after layoff (>10% cut odds) | [V0] | Stressed calibration ~40% |
| Job hop salary increase | [V0] | |
| Career pivot (+/− layoff, salary, time) | [V1] | |
| Graduate school (scholarship probability, loans) | [V1] | College Scorecard calibration |
| Return-to-office mandates | [V1] | Commute time cost |
| Promotion / passed over / burnout | [V1] | |
| Gig economy (fulfillment rate, SE tax) | [V2] | |
| Visa/work authorization constraints | [V3] | Optional scenario |

## C. Ledger & Accounts

| Feature | Status | Notes |
|---------|--------|-------|
| Monthly payroll & withholding | [V0] | |
| Federal + state income tax | [V0] stub | 8 states V0; 50 [V3] |
| 401(k), Roth IRA, HSA, brokerage | [V0] | Limits 2026: $24.5k / $7.5k |
| Credit card, student loan, auto, mortgage | [V0] partial | Mortgage [V2] |
| Sinking funds (wedding, travel, down payment) | [V1] | |
| RSU / ESPP | [V1] | Unvested excluded from liquid NW |
| Debt snowball vs avalanche tools | [V1] | Unlocked by quiz |
| Annual tax filing tick | [V1] | |
| IRS audit events | [V2] | Tied to complexity, not random punisher |

## D. Spending & Habits

| Feature | Status | Notes |
|---------|--------|-------|
| Category budgets (50/30/20 teaching) | [V0] | |
| Delivery vs cooking ROI path | [V0] | |
| Lifestyle creep detection | [V1] | |
| Subscription detector | [V1] | Literacy unlock |
| Vacation frequency toggle | [V1] | |
| Rent burden rules (28%/30%/35% warnings) | [V1] | |

## E. Housing

| Feature | Status | Notes |
|---------|--------|-------|
| Rent with renewal increases | [V0] | |
| Relocation costs (household size scaled) | [V1] | $200–$3k+ bands |
| Relocation reimbursement (50% employer offer) | [V1] | |
| State tax burden on move | [V0] stub | |
| Home purchase (PITI, PMI, closing) | [V2] | 6.55%–8% rates |
| House-poor events (HOA, insurance, maintenance) | [V2] | 45% normal / 55% hard yearly |
| DreamHome window (10 listings / 6 mo) | [V1] lite | Synthetic listings |
| Affordability gates (30/30/3, 28/36, liquidity) | [V1] | Knowledge-gated |
| Home vs rent break-even | [V1] | |
| **Rent surges** | [V1] | ZORI-style calibrated |
| **Zillow dreamer listings** (CA, WA, FL, NY, TX, NC, SC, TN) | [V1] | Synthetic from FHFA/ZORI; no scraping |

## F. Health & Insurance

| Feature | Status | Notes |
|---------|--------|-------|
| PPO / HMO / HDHP plan structures | [V0] | Premium, deductible, OOP max |
| ER / urgent / admission cost simulation | [V0] | Allowed amount, deductible, coinsurance |
| COBRA / marketplace transition | [V1] | |
| **Dental insurance & events** | [V2] | Annual max, waiting periods |
| **Vision** | [V2] | |
| **Disability (STD/LTD)** | [V2] | Own-occupation teaching |
| **Life insurance (term vs whole)** | [V2] | Opportunity cost of whole life |
| Pet insurance & vet emergencies | [V2] | |
| Fertility, pregnancy, parental leave | [V2] | |

## G. Transportation

| Feature | Status | Notes |
|---------|--------|-------|
| Car ownership (20/3/8 rule) | [V1] | |
| **Auto insurance** (location, age, history) | [V1] | |
| Public transit hazards toggle | [V1] | |
| Traffic / commute time cost | [V1] | |
| EV vs ICE cost fork | [V3] | |

## H. Relationships & Household

| Feature | Status | Notes |
|---------|--------|-------|
| Romance / partner income | [V2] | |
| Divorce toggle & fallout | [V2] | Warning-sign driven, not pure RNG |
| Wedding costs | [V1] | |
| Children, childcare, 529 | [V2] | |
| Combined vs separate finances | [V2] | |
| Elder care / family remittance | [V3] | |

## I. Macro & Investing

| Feature | Status | Notes |
|---------|--------|-------|
| Regime-switching macro (expansion, recession, …) | [V0] | Correlated variables |
| S&P return bands (7–13% normal; fat tails if enabled) | [V0] | |
| Recession portfolio drawdown (20–35%) | [V1] | |
| Depression stress (75–90%) | [V2] toggle | Crisis sandbox |
| Home price paths (usually −2–4%; GR −20%+) | [V2] | |
| Monte Carlo (10th–90th, Coast FIRE range) | [V1] | Unlocked by quiz |
| 2-fund / 3-fund portfolio teaching | [V1] | |
| DCA vs lump sum note | [V1] | |
| Sequence-of-returns risk | [V2] | |

## J. Events & Narrative

| Feature | Status | Notes |
|---------|--------|-------|
| Structured event schema | [V0] | |
| 20 events V0 / 50+ V1 | [V0]/[V1] | |
| Quiet periods (no crisis) | [V0] | |
| Interrupt mid-cycle decisions | [V0] | |
| Open-ended player action parsing | [V1] | Template + optional LLM |
| Stakeholder reaction cards | [V1] | |
| Timeline history | [V1] | |

## K. Financial Literacy Skill Tree

| Track | Unlocks | Status |
|-------|---------|--------|
| Cash Flow I | Waterfall, subscription detector | [V1] |
| Emergency Readiness | Runway calculator | [V1] |
| Credit & Debt | Optimizer, refinance compare | [V1] |
| Workplace Benefits | Total comp analyzer | [V1] |
| Investing I | Portfolio builder, Rule of 72 | [V1] |
| Investing II | Tax-aware, Monte Carlo | [V1] |
| Housing | DreamHome gates, stress test | [V1] |
| Transportation | True cost of ownership | [V1] |
| Insurance | Coverage gap map | [V2] |
| Taxes | Withholding projection | [V1] |
| Consumer Defense | Scam warnings | [V2] |

Quiz formats: prediction (First $100K), ordering (retirement ladder), spot-the-fee, plan comparison.

## L. State Tax Generalizations `[?]`

| Feature | Status | Notes |
|---------|--------|-------|
| No-income-tax states (FL, TX, WA, TN) | [V0] | |
| Flat rate (NC, etc.) | [V0] | |
| Progressive (CA, NY) | [V1] | Bracket stubs |
| Local tax (NYC) | [V2] | |
| Sales tax approximation | [V2] | |
| Property tax by state | [V1] | For DreamHome |

**Spike ticket:** TBD in E002 - Tax Foundation table ingest.

## M. Endings & Scoring

| Feature | Status | Notes |
|---------|--------|-------|
| Age 65 | [V0] | |
| Coast FIRE exit | [V1] | |
| Voluntary end | [V0] | |
| Insolvency / bankruptcy | [V1] | |
| LT unemployment strict end (optional) | [V1] | Default: Emergency Mode |
| Five-dimension final score | [V1] | Resilience, goals, career, decisions, life satisfaction |
| Counterfactual same-seed report | [V1] | |
| Luck vs decision quality split | [V1] | |

## N. Platform `[V3]`

- Teacher dashboard & assignments
- Shareable seeded challenges
- Scenario creator export
- Learning analytics
- 50-state tax system
- Licensed live listing integration (optional)

---

## Explicitly Out of Scope (for now)

- Real-money transactions or bank linking
- Individual stock picking as optimal strategy
- Crypto as primary wealth path
- Scraping Zillow/Redfin for live listings
- Using protected characteristics as arbitrary penalties

## Related

- [State model](../schema/state-model.md)
- [Event schema](../schema/event-schema.md)
- [PLAN.md](../../PLAN.md)
