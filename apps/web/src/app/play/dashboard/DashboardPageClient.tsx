'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FinalReportPanel } from '../../../components/play/FinalReportPanel';
import { LifeCompass, buildLifeCompassDimensions } from '../../../components/play/LifeCompass';
import { MetricsRibbon } from '../../../components/play/MetricsRibbon';
import { SkillTreeStub } from '../../../components/play/SkillTreeStub';
import { TimelineHistory } from '../../../components/play/TimelineHistory';
import {
  beginNextChapterPeriod,
  buildSkillTreeProgress,
  clearPlaySession,
  endSimulation,
  formatChapterLabel,
  isSimulationComplete,
  isSimulationEnded,
} from '../../../lib/play-session';
import { chapterShellPathWithStage, selectRibbonMetrics } from '@fad/domain';
import { usePlaySession } from '../../../lib/use-play-session';

export function DashboardPageClient() {
  const router = useRouter();
  const { session, ready, setSession } = usePlaySession();

  if (!ready || !session?.currentAudit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading dashboard…
      </div>
    );
  }

  const audit = session.currentAudit;
  const metrics = selectRibbonMetrics(session);
  const skills = buildSkillTreeProgress(session);
  const compass = buildLifeCompassDimensions(audit, metrics.housingBurdenPct);
  const ended = isSimulationEnded(session);
  const showFinalReport = ended || isSimulationComplete(session);

  const handleNewRun = () => {
    clearPlaySession();
  };

  const handleVoluntaryExit = () => {
    const next = endSimulation(session, 'voluntary');
    setSession(next);
    router.push('/play/end');
  };

  const handleContinuePlaying = () => {
    const next = beginNextChapterPeriod(session);
    setSession(next);
    router.push(
      chapterShellPathWithStage(next.gameState.run.id, next.periodIndex + 1, 'openingBriefing'),
    );
  };

  return (
    <div className="space-y-8">
      <MetricsRibbon metrics={metrics} />

      {showFinalReport ? (
        <FinalReportPanel session={session} />
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-accent">Net-worth dashboard</p>
          <h2 className="mt-1 font-serif text-2xl text-ink">
            {formatChapterLabel(audit.asOf, session.periodIndex - 1)}
          </h2>
          <p className="mt-3 text-muted">
            Track your path, literacy unlocks, and end the run when you are ready.
          </p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Life Compass</h2>
        <p className="text-sm text-muted">Five dimensions from ledger-derived metrics.</p>
        <LifeCompass dimensions={compass} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Timeline</h2>
        <TimelineHistory
          entries={session.periodHistory ?? []}
          startingNetWorth={session.startingNetWorth}
          startDate={session.gameState.run.startDate}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Skill tree</h2>
        <p className="text-sm text-muted">
          Ten literacy tracks. Quizzes unlock analysis tools, not market luck.
        </p>
        <SkillTreeStub skills={skills} />
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap">
        {!ended && session.periodIndex < session.maxPeriods ? (
          <button
            type="button"
            onClick={handleContinuePlaying}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            Continue next chapter
          </button>
        ) : null}
        {!ended ? (
          <button
            type="button"
            onClick={handleVoluntaryExit}
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
          >
            End simulation
          </button>
        ) : null}
        <Link
          href="/scenarios"
          onClick={handleNewRun}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Start a new scenario
        </Link>
        <Link
          href="/play/lab"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Open planning lab
        </Link>
        <Link
          href="/play/audit"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Review last audit
        </Link>
        {showFinalReport ? (
          <Link
            href="/play/end"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
          >
            Open final report
          </Link>
        ) : null}
      </div>
    </div>
  );
}
