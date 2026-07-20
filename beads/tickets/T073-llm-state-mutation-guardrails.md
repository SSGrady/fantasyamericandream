---
id: T073
title: LLM state mutation guardrails
status: done
type: task
priority: P1
epic: E010
sprint: S013
depends_on:
  - T069
acceptance:
  - Static analysis or tests assert no LLM output path calls ledger/sim mutators
  - Runtime guard rejects objects with account balance fields from LLM parser
  - Documented in ADR-003 narrative boundaries
  - Red-team test attempts injection via prompt and malformed JSON
---

# T073 - LLM State Mutation Guardrails

## Description

Ensure narrative layer cannot become backdoor for financial state changes.

## Scope

- Tests in narrative package
- CI check if feasible

## Grill me

- ESLint rule banning imports from ledger in llm/ folder?
- Runtime wrapper around all LLM parse entry points?
- Pen test scope: prompt injection only, or fuzzing too?
