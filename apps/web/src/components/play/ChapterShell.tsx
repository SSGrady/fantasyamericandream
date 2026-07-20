'use client';

import type { ChapterCloseTab, ChapterStage } from '@fad/domain';
import { chapterShellPathWithStage, selectLifeRailData } from '@fad/domain';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { BriefingPageClient } from '../../app/play/briefing/BriefingPageClient';
import { DecidePageClient } from '../../app/play/decide/DecidePageClient';
import { PlanningPageClient } from '../../app/play/planning/PlanningPageClient';
import { ProcessingPageClient } from '../../app/play/processing/ProcessingPageClient';
import {
  applyChapterLessonUnlock,
  canAdvanceToStage,
  deriveChapterStage,
  setChapterStage,
  type PlaySession,
} from '../../lib/play-session';
import { usePlaySession } from '../../lib/use-play-session';
import { ChapterClosePanel } from './ChapterClosePanel';
import { LifeRail } from './LifeRail';
import { StageIndicator } from './StageIndicator';

interface ChapterShellProps {
  runId: string;
  chapterNumber: number;
}

function parseStage(value: string | null): ChapterStage | null {
  if (
    value === 'openingBriefing' ||
    value === 'planning' ||
    value === 'simulating' ||
    value === 'chapterClose'
  ) {
    return value;
  }
  return null;
}

function parseTab(value: string | null): ChapterCloseTab {
  if (value === 'money' || value === 'whatIf' || value === 'voices' || value === 'lesson') {
    return value;
  }
  return 'story';
}

export function ChapterShell({ runId, chapterNumber }: ChapterShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, ready, setSession } = usePlaySession({ redirectTo: '/create/modules' });

  const urlStage = parseStage(searchParams.get('stage'));
  const urlTab = parseTab(searchParams.get('tab'));

  const stage = useMemo(() => {
    if (!session) return 'openingBriefing' as ChapterStage;
    return urlStage ?? deriveChapterStage(session);
  }, [session, urlStage]);

  const syncUrl = useCallback(
    (nextStage: ChapterStage, tab?: ChapterCloseTab) => {
      if (!session) return;
      router.replace(chapterShellPathWithStage(session.gameState.run.id, chapterNumber, nextStage, tab));
    },
    [router, session, chapterNumber],
  );

  useEffect(() => {
    if (!ready || !session) return;
    if (session.gameState.run.id !== runId) return;
    if (Number.isNaN(chapterNumber) || chapterNumber < 1) return;

    let next = session;
    const derived = deriveChapterStage(session);
    const targetStage = urlStage ?? derived;
    if (targetStage !== session.chapterStage) {
      next = setChapterStage(session, targetStage, urlTab);
      setSession(next);
    }
    if (targetStage === 'chapterClose' && !next.chapterLessonUnlock) {
      const unlocked = applyChapterLessonUnlock(next);
      if (unlocked !== next) setSession(unlocked);
    }
  }, [ready, session, runId, chapterNumber, urlStage, urlTab, setSession]);

  if (!ready || !session) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-muted">Loading chapter shell…</div>
    );
  }

  if (session.gameState.run.id !== runId) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-muted">Run not found.</div>
    );
  }

  const lifeRail = selectLifeRailData(session);
  const lockedAfter: ChapterStage | undefined =
    session.currentAudit ? undefined : stage === 'simulating' ? 'simulating' : 'planning';

  const advanceStage = (next: ChapterStage, tab?: ChapterCloseTab) => {
    if (!canAdvanceToStage(session, next) && next !== stage) return;
    const updated = setChapterStage(session, next, tab);
    setSession(updated);
    syncUrl(next, tab);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StageIndicator active={stage} lockedAfter={lockedAfter} />
        <p className="text-sm text-muted">
          Chapter {chapterNumber} · Run {runId.slice(0, 8)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <LifeRail data={lifeRail} />
        </div>
        <div className="lg:col-span-9">
          <div key={stage} className="phase-enter">
            {stage === 'openingBriefing' ? <BriefingPageClient /> : null}
            {stage === 'planning' ? <PlanningPageClient /> : null}
            {stage === 'simulating' ? (
              session.chapterPeriod.status === 'in_progress' || session.tickInProgress ? (
                <ProcessingPageClient />
              ) : (
                <DecidePageClient />
              )
            ) : null}
            {stage === 'chapterClose' ? (
              <ChapterClosePanel
                session={session}
                activeTab={urlTab ?? session.chapterCloseTab}
                onTabChange={(tab) => {
                  const updated = setChapterStage(session, 'chapterClose', tab);
                  setSession(updated);
                  syncUrl('chapterClose', tab);
                }}
                onContinue={() => router.push('/play/dashboard')}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
