---
id: E010
title: Local LLM Narrative Layer
status: open
priority: P3
sprints:
  - S013
---

# E010 - Local LLM Narrative Layer (P5)

## Goal

Add optional local LLM enrichment for action interpretation, stakeholder reactions, and chapter summaries. Template-first with deterministic fallback; validated output never mutates ledger state.

## Success Criteria

- [ ] Template-first narrative for all surfaces (deterministic fallback always available)
- [ ] Zod schemas for LLM output; reject and fallback on validation failure
- [ ] WebLLM worker for browser-local inference (no API keys required)
- [ ] LLM assists action interpretation hints, not command execution
- [ ] Reaction and summary generation from structured TurnResult
- [ ] Guardrail tests: unvalidated text cannot change PlayerState or accounts

## Sprints

| Sprint | Goal | Status |
|--------|------|--------|
| [S013](../sprints/S013-llm-narrative-layer/sprint.md) | Local LLM narrative layer | Open |

## Tickets

| ID | Title | Status |
|----|-------|--------|
| [T068](../tickets/T068-template-first-narrative.md) | Template-first narrative | open |
| [T069](../tickets/T069-zod-llm-output-schemas.md) | Zod LLM output schemas | open |
| [T070](../tickets/T070-webllm-worker-setup.md) | WebLLM worker setup | open |
| [T071](../tickets/T071-llm-action-interpretation.md) | LLM action interpretation | open |
| [T072](../tickets/T072-llm-reactions-summaries.md) | LLM reactions and summaries | open |
| [T073](../tickets/T073-llm-state-mutation-guardrails.md) | LLM state mutation guardrails | open |

## Depends On

- [E008](./E008-consequence-theater-visual-design.md) - narrative renders in theater surfaces
- [E005](./E005-action-command-system.md) - commands are structured input to narrative

## Related

- [ADR 003](../../docs/adr/003-three-engine-architecture.md) - narrative engine boundaries
- [ADR 010](../../docs/adr/010-game-loop-and-consequence-pipeline.md)
