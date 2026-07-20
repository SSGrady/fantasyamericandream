---
id: T072
title: LLM reactions and summaries
status: done
type: feature
priority: P2
epic: E010
sprint: S013
depends_on:
  - T059
  - T069
  - T070
acceptance:
  - LLM optionally rewrites stakeholder quotes and chapter summary from TurnResult JSON input
  - Template fallback on validation failure or timeout
  - Timeout budget documented (e.g. 3s then fallback)
  - A/B dev toggle compares template vs LLM copy
---

# T072 - LLM Reactions and Summaries

## Description

Enrich stakeholder voices and consequence headlines when model available.

## Scope

- Narrative LLM adapter
- Reactions/consequence integration

## Grill me

- LLM rewrites all voices, or one "featured" quote only?
- Pass full ledger JSON to prompt, or summarized TurnResult only (privacy/perf)?
- Tone guardrails: block political rants, enforce PG-13?
