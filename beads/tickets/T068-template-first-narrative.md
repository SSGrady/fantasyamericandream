---
id: T068
title: Template-first narrative
status: open
type: feature
priority: P1
epic: E010
sprint: S013
depends_on:
  - T058
acceptance:
  - All narrative surfaces have Handlebars/Mustache-style templates from TurnResult
  - Fallback path always renders if LLM disabled or fails
  - Golden tests for template output on fixture TurnResults
  - No LLM required for chapter playthrough
---

# T068 - Template-First Narrative

## Description

Deterministic copy layer before any LLM enrichment.

## Scope

- `packages/narrative/src/templates/`

## Grill me

- Template engine: lightweight custom vs established lib?
- Store templates in TS strings, JSON, or markdown files?
- Per-chapter template overrides vs global partials?
