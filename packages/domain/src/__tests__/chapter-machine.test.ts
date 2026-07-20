import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { chapterMachine, nextChapterPhase } from '../chapter/chapter-machine.js';

describe('chapterMachine', () => {
  it('advances briefing to planning on ADVANCE', () => {
    const actor = createActor(chapterMachine);
    actor.start();
    expect(actor.getSnapshot().value).toBe('briefing');
    actor.send({ type: 'ADVANCE' });
    expect(actor.getSnapshot().value).toBe('planning');
    expect(actor.getSnapshot().context.phase).toBe('planning');
  });

  it('computes next phase in pipeline order', () => {
    expect(nextChapterPhase('briefing')).toBe('planning');
    expect(nextChapterPhase('dashboard')).toBeNull();
  });
});
