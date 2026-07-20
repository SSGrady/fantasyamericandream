# Product Thesis

**Fantasy American Dream: Class of 2026**  
*Build a career. Survive the economy. Buy back your time.*

## The Problem

Starting a white-collar career in 2026 means navigating:

- Post-2023 labor market reset (1.1% baseline monthly layoff flow, sector spikes in tech)
- Salary **resets** after displacement (>40% of re-employed workers accepting >10% cuts in stressed markets)
- 6.55%–8% mortgage rates and rent surge risk
- Health insurance complexity (HDHP vs PPO, deductibles ~$1,900 single)
- Lifestyle leakage from college habits (delivery, subscriptions)
- Ghost jobs consuming search time while debt accrues interest

Spreadsheets and budgeting apps track what happened. They do not teach **judgment under uncertainty**.

## The Solution

A **life-path RPG** where:

- Your character's money, career, health, relationships, geography, time, and knowledge interact
- The simulation performs rigorous accounting underneath
- Every six months you receive a forensic audit and choose the next chapter
- Financial literacy is a **skill tree** that unlocks analysis - not luck modifiers

## Core Loop

**V1 (shipped):** configure character, run six-month sim, read audit reports.

**V1.5 north star (consequence-driven):**

```
Briefing → Planning → Simulating → Consequence → Counterfactual → Audit → Dashboard
```

Players set **persistent action commands** (401k rate, job search intensity, delivery cap) on Decision Day. Authored **chapters** deliver interrupts and stakes. **Attribution** separates contributions, lifestyle leakage, and macro luck. Presentation is **consequence theater**, not spreadsheet export.

Inspired by Fantasy President Career’s consequence pipeline, with original branding and mechanics. See [ADR-010](../adr/010-game-loop-and-consequence-pipeline.md).

## Design Principles

1. **Tradeoffs, not cheapest-wins** - Higher salary may mean layoff risk or less time with family.
2. **Skill ≠ luck** - Final report separates decision quality from macro luck; same-seed replay enabled.
3. **Knowledge unlocks tools** - Passing the "First $100K" quiz unlocks savings-rate emphasis in projections, not better stock picks.
4. **Monthly truth, six-month story** - Engine ticks monthly; player sees meaningful chapters.
5. **Emergency mode, not instant death** - Long-term unemployment opens hardship teaching, not immediate game over.

## Target Player

- New grads (target and non-target schools)
- Early-career professionals considering pivot, grad school, or relocation
- Anyone who learns better from simulated consequences than abstract rules

## North-Star Moment

After six months in-game, the player sees an editorial headline and forensic breakdown:

> Net worth up $4,200: $2,800 from your contributions, $400 from markets, $1,650 lost to delivery. The offer you declined would have paid 18% more but cost 7 commute hours weekly.

They **feel** the first-$100K lesson because they **chose** commands, survived interrupts, and compared counterfactuals, not because they read a static report.

## Related Docs

- [Feature set](./feature-set.md) - exhaustive system inventory
- [User journey](./user-journey.md) - first-run flow
- [ADR 001](../adr/001-project-vision-and-phasing.md) - phasing
