---
id: T069
title: Zod LLM output schemas
status: done
type: feature
priority: P1
epic: E010
sprint: S013
depends_on:
  - T068
acceptance:
  - Zod schemas for LLM outputs: headline, stakeholder quote, action summary
  - Parser rejects invalid JSON/shape; triggers template fallback
  - Schema version field in output for forward compatibility
  - Tests with adversarial malformed payloads
---

# T069 - Zod LLM Output Schemas

## Description

Structured validation boundary between LLM text and UI.

## Scope

- `packages/narrative/src/llm/schemas.ts`

## Grill me

- Max quote length cap to prevent UI overflow?
- Allow markdown in LLM output, or plain text only?
- Log validation failures locally for debugging, or silent fallback?
