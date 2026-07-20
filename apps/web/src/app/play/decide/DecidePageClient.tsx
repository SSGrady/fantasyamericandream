'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CommandCenter } from '../../../components/play/CommandCenter';
import { LiteracyQuizStub } from '../../../components/play/LiteracyQuizStub';
import {
  commitCommandDraft,
  savePlaySession,
  unlockLiteracySkill,
  type PendingDecision,
} from '../../../lib/play-session';
import { usePlaySession } from '../../../lib/use-play-session';

export function DecidePageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();
  const [action, setAction] = useState('');

  useEffect(() => {
    if (session?.playerAction) {
      setAction(session.playerAction);
    }
  }, [session?.playerAction]);

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading decision day…
      </div>
    );
  }

  const effectiveMonthKey = session.gameState.run.currentDate.slice(0, 7);

  const handleContinue = () => {
    const withAction = {
      ...session,
      playerAction: action.trim(),
      commandDraft: session.commandDraft,
    };
    const committed = commitCommandDraft(withAction);
    setSession(committed);
    if (committed.commandCapacityError) {
      return;
    }
    router.push('/play/processing');
  };

  const handleQuizAnswer = (correct: boolean) => {
    let next = { ...session, literacyQuizAnswered: true };
    if (correct) {
      next = unlockLiteracySkill(next, 'investing_i');
    }
    savePlaySession(next);
    setSession(next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-accent">Decision day</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Set persistent commands</h2>
        <p className="mt-3 text-muted">
          Commands persist through the next six-month chapter. Passive finance knobs cost zero
          capacity; career and lifestyle actions consume weekly hours.
        </p>
      </div>

      <LiteracyQuizStub
        answered={session.literacyQuizAnswered ?? false}
        onAnswer={handleQuizAnswer}
      />

      <CommandCenter
        effectiveMonthKey={effectiveMonthKey}
        commands={session.commandDraft}
        capacityError={session.commandCapacityError}
        onChange={(commandDraft) => {
          const next = { ...session, commandDraft, commandCapacityError: null };
          savePlaySession(next);
          setSession(next);
        }}
      />

      <div className="space-y-4">
        {session.pendingDecisions.map((decision: PendingDecision) => (
          <div
            key={decision.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {decision.kind === 'required' ? 'Required' : 'Opportunity'}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{decision.title}</h3>
                <p className="mt-1 text-sm text-muted">{decision.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <label htmlFor="player-action" className="text-sm font-medium text-ink">
          Free-text action (optional)
        </label>
        <textarea
          id="player-action"
          rows={3}
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Example: increase deferrals to 12%, pause delivery apps."
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => router.push('/play/briefing')}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to briefing
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Submit commands
        </button>
      </div>
    </div>
  );
}
