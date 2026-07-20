import { z } from 'zod';

export const llmNarrativeSchema = z.object({
  headline: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  tone: z.enum(['neutral', 'urgent', 'celebratory']),
});

export const llmActionInterpretationSchema = z.object({
  commands: z.array(
    z.object({
      type: z.string(),
      label: z.string(),
      confidence: z.number().min(0).max(1),
    }),
  ),
  requiresConfirmation: z.boolean(),
});

export type LlmNarrativeOutput = z.infer<typeof llmNarrativeSchema>;
export type LlmActionInterpretation = z.infer<typeof llmActionInterpretationSchema>;

export function parseLlmNarrative(raw: unknown): LlmNarrativeOutput | null {
  const parsed = llmNarrativeSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function parseLlmActionInterpretation(raw: unknown): LlmActionInterpretation | null {
  const parsed = llmActionInterpretationSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
