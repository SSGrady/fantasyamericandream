import { describe, expect, it } from 'vitest';
import { appendDecisionRecord, createDecisionRecord } from '../decision-record/append.js';

describe('DecisionRecord', () => {
  it('appends unique records and dedupes identical payload hash', () => {
    const base = createDecisionRecord({
      timestamp: '2026-01-01',
      chapterNumber: 1,
      actionType: 'plan_committed',
      payload: { commands: [] },
      randomSeed: 'seed-a',
    });
    const dup = createDecisionRecord({
      timestamp: '2026-01-02',
      chapterNumber: 1,
      actionType: 'plan_committed',
      payload: { commands: [] },
      randomSeed: 'seed-a',
    });
    const log = appendDecisionRecord([], base);
    expect(appendDecisionRecord(log, dup)).toHaveLength(1);
    expect(appendDecisionRecord(log, { ...dup, actionType: 'offer_accepted' })).toHaveLength(2);
  });
});
