import type { DecisionActionType, DecisionRecord } from './types.js';

function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.keys(v)
          .sort()
          .reduce<Record<string, unknown>>((acc, key) => {
            acc[key] = (v as Record<string, unknown>)[key];
            return acc;
          }, {})
      : v,
  );
}

export function hashDecisionPayload(payload: unknown): string {
  const data = stableStringify(payload);
  let hash = 0;
  for (let i = 0; i < data.length; i += 1) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash).toString(16)}`;
}

export function createDecisionRecord(input: {
  timestamp: DecisionRecord['timestamp'];
  chapterNumber: number;
  actionType: DecisionActionType;
  payload: unknown;
  randomSeed: string;
}): DecisionRecord {
  return {
    id: `${input.actionType}-${input.chapterNumber}-${Date.now()}`,
    timestamp: input.timestamp,
    chapterNumber: input.chapterNumber,
    actionType: input.actionType,
    payloadHash: hashDecisionPayload(input.payload),
    payload: input.payload,
    randomSeed: input.randomSeed,
  };
}

export function appendDecisionRecord(
  log: DecisionRecord[],
  record: DecisionRecord,
): DecisionRecord[] {
  const last = log[log.length - 1];
  if (last?.payloadHash === record.payloadHash && last.actionType === record.actionType) {
    return log;
  }
  return [...log, record];
}
