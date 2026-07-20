import { parseLlmActionInterpretation } from './schemas.js';

export interface NaturalLanguageInterpretResult {
  ok: boolean;
  commands: { type: string; label: string; confidence: number }[];
  requiresConfirmation: boolean;
  source: 'template' | 'llm';
}

/** Interpret NL player intent. Returns confirm/edit flow; never applies commands directly. */
export function interpretNaturalLanguageAction(
  text: string,
  llmPayload?: unknown,
): NaturalLanguageInterpretResult {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) {
    return { ok: false, commands: [], requiresConfirmation: true, source: 'template' };
  }

  if (process.env.NEXT_PUBLIC_ENABLE_LLM === 'true' && llmPayload) {
    const parsed = parseLlmActionInterpretation(llmPayload);
    if (parsed) {
      return {
        ok: true,
        commands: parsed.commands,
        requiresConfirmation: parsed.requiresConfirmation,
        source: 'llm',
      };
    }
  }

  if (trimmed.includes('save') || trimmed.includes('hysa')) {
    return {
      ok: true,
      commands: [{ type: 'transfer_to_hysa', label: 'Transfer to HYSA', confidence: 0.7 }],
      requiresConfirmation: true,
      source: 'template',
    };
  }

  return {
    ok: true,
    commands: [{ type: 'note', label: trimmed.slice(0, 80), confidence: 0.5 }],
    requiresConfirmation: true,
    source: 'template',
  };
}
