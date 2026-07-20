---
id: T070
title: WebLLM worker setup
status: open
type: feature
priority: P2
epic: E010
sprint: S013
depends_on: []
acceptance:
  - WebLLM loads chosen model in dedicated worker
  - Model download progress UI; graceful unsupported-browser message
  - Inference never blocks main thread > 100ms without loading state
  - Feature flag to disable LLM entirely
---

# T070 - WebLLM Worker Setup

## Description

Browser-local LLM for optional narrative enrichment without API keys.

## Scope

- `apps/web/src/workers/llm.worker.ts`
- Env flag `NEXT_PUBLIC_ENABLE_LLM`

## Grill me

- Default model size vs quality tradeoff (Phi-3 mini vs Llama 3 8B)?
- Require user opt-in download (~GB), or bundle tiny model?
- Safari/WebGPU support matrix: block or CPU fallback?
