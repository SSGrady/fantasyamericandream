---
id: S013
title: Local LLM Narrative Layer
status: open
priority: P3
epic: E010
start_date: null
---

# S013 - Local LLM Narrative Layer (P5)

## Goal

Template-first narrative with optional WebLLM enrichment. Zod validation; never mutate state from unvalidated text.

## Tickets

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| [T068](../../tickets/T068-template-first-narrative.md) | Template-first narrative | P1 | open |
| [T069](../../tickets/T069-zod-llm-output-schemas.md) | Zod LLM output schemas | P1 | open |
| [T070](../../tickets/T070-webllm-worker-setup.md) | WebLLM worker setup | P2 | open |
| [T071](../../tickets/T071-llm-action-interpretation.md) | LLM action interpretation | P2 | open |
| [T072](../../tickets/T072-llm-reactions-summaries.md) | LLM reactions and summaries | P2 | open |
| [T073](../../tickets/T073-llm-state-mutation-guardrails.md) | LLM state mutation guardrails | P1 | open |

## Progress

See [PROGRESS.md](./PROGRESS.md).

## Depends On

- S008 commands (structured input)
- S011 consequence theater (render surfaces)
