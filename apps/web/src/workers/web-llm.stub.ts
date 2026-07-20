/** Optional local LLM worker stub. Enable with NEXT_PUBLIC_ENABLE_LLM=true. */
export interface WebLlmWorkerStatus {
  ready: boolean;
  modelId: string | null;
}

export function getWebLlmWorkerStatus(): WebLlmWorkerStatus {
  if (process.env.NEXT_PUBLIC_ENABLE_LLM !== 'true') {
    return { ready: false, modelId: null };
  }
  return { ready: false, modelId: 'stub-not-loaded' };
}
