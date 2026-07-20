# ADR 008: Data Calibration and Versioned Rulesets

## Status

Accepted

## Date

2026-07-19

## Context

The simulator claims teaching value only if probabilities and dollar amounts are defensible. Mortgage rates, contribution limits, layoff hazards, ER costs, and state taxes must be traceable to sources and versioned by tax year.

## Decision

### Authoritative data layers

| Domain | Primary sources | Package location |
|--------|-----------------|------------------|
| Wages & occupations | BLS OEWS, O*NET | `data/calibration/careers/` |
| Macro & inflation | FRED, BLS CPI, JOLTS | `data/calibration/macro/` |
| Housing | FHFA HPI, ACS, Zillow Research indices | `data/calibration/housing/` |
| Mortgage rates | Freddie Mac PMMS | `data/calibration/housing/mortgage-rates.json` |
| Taxes | IRS, Tax Foundation state tables | `data/calibration/tax/` |
| Health premiums | KFF employer survey | `data/calibration/health/` |
| Education | College Scorecard | `data/calibration/education/` |
| Hazards | FEMA NRI, NOAA | `data/calibration/hazards/` |

### Versioned rulesets

Each run stores:

```typescript
{
  simulationVersion: string;      // e.g. "0.1.0"
  dataSnapshot: string;         // e.g. "2026.1"
  taxYear: number;              // e.g. 2026
  randomSeed: string;
  enabledModules: string[];
}
```

Tax and limit examples for 2026:

- 401(k) deferral: $24,500
- IRA: $7,500
- Mortgage rate base range: 6.55%–8% (stress overlay in macro regimes)

### Calibration principles

- Ranges and confidence labels where data is uncertain (ghost-job rate, salary reset after layoff)
- Correlated macro regimes - recessions affect layoffs, returns, rates, rent together
- Do not scrape consumer listing sites; synthetic DreamHome listings from calibrated distributions
- Easy/Medium/Hard modify **information and tail risk**, not fabricated 20% guaranteed returns

## Consequences

- `packages/data` loads calibration by snapshot ID.
- Changing calibration bumps `dataSnapshot` - old runs remain reproducible with pinned snapshot.
- New data sources require ADR amendment or new ADR.

## Alternatives Considered

- **Hardcoded constants in code** - rejected; untraceable, hard to update yearly.
- **Live API dependency for V0** - rejected; offline replay and tests require bundled snapshots.
