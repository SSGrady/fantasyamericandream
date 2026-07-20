# Housing and Rent System Specification

Point-in-time planning artifact for metrics corrections and housing depth. Durable decisions promote to `docs/adr/` and `docs/schema/`.

Related beads: [S005](../../beads/sprints/S005-v1-metrics-housing-fixes/sprint.md) (T016-T019).

---

## Problem Statement

Briefing metrics mislead players:

| Metric | Current behavior | Correct behavior |
|--------|------------------|------------------|
| Savings rate | `(gross - taxes - rent - debt) / gross` (~52% in CA) | `(401k + HSA + brokerage + Roth + HYSA transfers) / net pay` |
| Take-home | Gross payroll waterfall / 6 | Net pay after 401k deferral, documented formula |
| Housing burden | Rent / period gross | Player rent share / net pay |
| DTI | Min payments / gross monthly | Min payments / net pay (or documented gross variant) |

Flat rent ($2500/mo LA) ignores roommates, partner splits, and COL variance.

---

## Grill-me Resolutions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Roommate count vs explicit 4/2/solo buttons? | **Explicit 4 / 2 / solo buttons** | Maps cleanly to rent fractions (1/4, 1/2, 1); avoids ambiguous "3 roommates" edge cases in V1 |
| Partner split 50/50 default? | **Yes, 50/50 default** | Cohabiting norm; "pay alone" option for separate leases |
| Utilities same split as rent? | **Yes, same split logic** | One housing arrangement drives both rent and utilities stub |
| COL tiers per state or per metro when both selected? | **Metro overrides state tier when metro selected; state tier otherwise** | Metro is finer grain; state tier is fallback for V1 state-only picker |
| Stochastic rent each run or fixed at character create? | **Fixed at character create** | Preserves deterministic replay (same seed + draft → same rent) |

---

## Phased Delivery

### V1.1 - Metrics fix (T016)

- Add `docs/schema/metrics-definitions.md`
- Fix `computeSavingsRate`, ribbon metrics, audit labels
- Update golden fixtures

No housing UI changes in this phase.

### V1.2 - Housing UI + COL tiers (T017, T018)

- Character creator housing arrangement selector
- Rent split applied in `build-game-state`
- COL-tier bands replace flat state rent constants
- Calibration: `packages/data/src/calibration/housing/`

### V2 - Metro depth (T019)

- Top 25 GDP metro ZORI-style anchors
- `metroId → rentMultiplier` vs state baseline
- ADR stub; full metro picker UI post-V2

---

## Housing Arrangement Model (T017)

```typescript
type V1HousingArrangement =
  | 'roommates_4'   // rent / 4
  | 'roommate_1'    // rent / 2
  | 'solo'          // full rent
  | 'partner_split' // rent / 2 (partnered or married)
  | 'pay_alone';    // full rent despite partner
```

Split function:

```
playerRentShare = marketRent * fraction(arrangement)
playerUtilitiesShare = marketUtilities * fraction(arrangement)  // same fraction
```

Marital status gates available options:

| Status | Options |
|--------|---------|
| Single | roommates_4, roommate_1, solo |
| Partnered / Married | partner_split (default), pay_alone, solo |

---

## COL Tier Model (T018)

```typescript
type ColTier = 'VHCOL' | 'HCOL' | 'MCOL' | 'LCOL';

interface ColTierRentBand {
  tier: ColTier;
  minMonthlyCents: MoneyCents;
  maxMonthlyCents: MoneyCents;
}
```

State-to-tier mapping (initial):

| Tier | States (V0 set) |
|------|-----------------|
| VHCOL | CA, NY |
| HCOL | WA, IL |
| MCOL | TX, NC |
| LCOL | FL, TN |

Rent sampled once at character create: `seededUniform(min, max)` from tier band.

Sector salary variability remains in `v0-rent-only` career profiles; document that salary bands are independent of rent tier draw.

---

## Metro Rent Anchors (T019 stub)

User-provided ZORI-style values treated as **monthly USD** (verified: NY $2442.50 and LA $1354.70 are plausible metro medians, not thousands).

Schema:

```typescript
interface MetroRentAnchor {
  metroId: string;
  name: string;
  gdpRank: number;
  zoriMonthlyUsd: number;
  /** Multiplier vs state baseline rent from COL tier sample */
  rentMultiplierVsState: number;
}
```

Example anchors (monthly USD, illustrative):

| Metro | metroId | ZORI anchor | Notes |
|-------|---------|-------------|-------|
| New York | new_york_city | 2442.50 | VHCOL |
| Los Angeles | los_angeles | 1354.70 | VHCOL |
| San Francisco | san_francisco | 2100.00 | placeholder |
| Chicago | chicago | 1650.00 | placeholder |

Full top-25 table deferred to T019 implementation. Multiplier applied when metro depth enabled:

```
effectiveRent = stateBaselineRent * metro.rentMultiplierVsState
```

---

## Metrics Definitions Preview (T016)

Canonical doc: `docs/schema/metrics-definitions.md` (created in T016).

| Metric | Formula |
|--------|---------|
| Net pay (monthly) | Gross - federal withholding - FICA - 401k deferral |
| Savings rate | `(401k + HSA + brokerage + Roth + HYSA transfers) / net pay` over audit period |
| Housing burden | `playerRentShare / net pay` |
| DTI | `(CC min + student loan min + auto + mortgage) / net pay` |

---

## Dependencies

```
T016 (metrics) ──┐
                 ├──> T017 (housing UI) ──> T018 (COL tiers) ──> T019 (metro stub)
```

E003 dual-income stub (T020) is independent of S005 but shares `HouseholdState` types.
