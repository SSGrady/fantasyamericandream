import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import {
  chapterMachine,
  nextChapterStage,
  previousChapterStage,
} from '../chapter/chapter-machine.js';

describe('chapterMachine', () => {
  it('advances openingBriefing to planning on ADVANCE', () => {
    const actor = createActor(chapterMachine);
    actor.start();
    expect(actor.getSnapshot().value).toBe('openingBriefing');
    actor.send({ type: 'ADVANCE' });
    expect(actor.getSnapshot().value).toBe('planning');
    expect(actor.getSnapshot().context.stage).toBe('planning');
  });

  it('runs happy path through chapterClose', () => {
    const actor = createActor(chapterMachine);
    actor.start();
    actor.send({ type: 'ADVANCE' });
    actor.send({ type: 'ADVANCE' });
    actor.send({ type: 'ADVANCE' });
    expect(actor.getSnapshot().value).toBe('chapterClose');
  });

  it('INTERRUPT from simulating returns to planning', () => {
    const actor = createActor(chapterMachine);
    actor.start();
    actor.send({ type: 'ADVANCE' });
    actor.send({ type: 'ADVANCE' });
    expect(actor.getSnapshot().value).toBe('simulating');
    actor.send({ type: 'INTERRUPT' });
    expect(actor.getSnapshot().value).toBe('planning');
  });

  it('computes next and previous stage', () => {
    expect(nextChapterStage('openingBriefing')).toBe('planning');
    expect(previousChapterStage('planning')).toBe('openingBriefing');
    expect(nextChapterStage('chapterClose')).toBeNull();
  });
});
