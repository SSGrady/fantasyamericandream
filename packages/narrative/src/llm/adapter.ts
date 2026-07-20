import type { AuditSnapshot } from '@fad/shared';
import { renderBriefingHeadline } from '../briefing.js';
import { renderEditorialHeadline } from '../templates/briefing-templates.js';
import { parseLlmNarrative, type LlmNarrativeOutput } from './schemas.js';

export interface NarrativeAdapterInput {
  audit: AuditSnapshot;
  playerName: string;
  llmPayload?: unknown;
}

export interface NarrativeAdapterResult {
  headline: string;
  source: 'template' | 'llm';
}

/** Template-first with optional Zod-validated LLM enrichment. Never mutates state. */
export function adaptBriefingNarrative(input: NarrativeAdapterInput): NarrativeAdapterResult {
  const fallback = renderEditorialHeadline(input.audit, input.playerName);
  const legacy = renderBriefingHeadline(input.audit);

  if (process.env.NEXT_PUBLIC_ENABLE_LLM !== 'true' || !input.llmPayload) {
    return { headline: fallback || legacy, source: 'template' };
  }

  const parsed: LlmNarrativeOutput | null = parseLlmNarrative(input.llmPayload);
  if (!parsed) {
    return { headline: fallback || legacy, source: 'template' };
  }

  return { headline: parsed.headline, source: 'llm' };
}
