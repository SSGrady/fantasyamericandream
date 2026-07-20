import type { ChapterCloseTab, ChapterPhase, ChapterStage } from './chapter-machine.js';

export function chapterShellPath(runId: string, chapterNumber: number): string {
  return `/play/${runId}/chapter/${chapterNumber}`;
}

export function chapterShellPathWithStage(
  runId: string,
  chapterNumber: number,
  stage: ChapterStage,
  closeTab?: ChapterCloseTab,
): string {
  const base = chapterShellPath(runId, chapterNumber);
  const params = new URLSearchParams({ stage });
  if (closeTab) params.set('tab', closeTab);
  return `${base}?${params.toString()}`;
}

/** Map legacy routes to chapter shell equivalents. */
export function legacyRouteToShell(
  pathname: string,
  runId: string,
  chapterNumber: number,
): string | null {
  if (pathname.includes('/play/briefing')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'openingBriefing');
  }
  if (pathname.includes('/play/planning') || pathname.includes('/play/decide')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'planning');
  }
  if (pathname.includes('/play/processing')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'simulating');
  }
  if (pathname.includes('/play/analysis') || pathname.includes('/play/reactions')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'chapterClose', 'story');
  }
  if (pathname.includes('/play/counterfactual')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'chapterClose', 'whatIf');
  }
  if (pathname.includes('/play/audit')) {
    return chapterShellPathWithStage(runId, chapterNumber, 'chapterClose', 'money');
  }
  return null;
}

/** @deprecated Use chapterShellPathWithStage */
export function chapterPhaseRoute(phase: ChapterPhase): string {
  switch (phase) {
    case 'briefing':
      return '/play/briefing';
    case 'planning':
      return '/play/planning';
    case 'simulating':
      return '/play/processing';
    case 'consequence':
      return '/play/analysis';
    case 'counterfactual':
      return '/play/counterfactual';
    case 'audit':
      return '/play/audit';
    case 'dashboard':
      return '/play/dashboard';
    default:
      return '/play/briefing';
  }
}

/** @deprecated Use legacyRouteToShell */
export function routeChapterPhase(pathname: string): ChapterPhase | null {
  if (pathname.includes('/play/briefing')) return 'briefing';
  if (pathname.includes('/play/planning')) return 'planning';
  if (pathname.includes('/play/processing')) return 'simulating';
  if (pathname.includes('/play/analysis') || pathname.includes('/play/reactions')) return 'consequence';
  if (pathname.includes('/play/counterfactual')) return 'counterfactual';
  if (pathname.includes('/play/audit') || pathname.includes('/play/dream-home')) return 'audit';
  if (pathname.includes('/play/dashboard') || pathname.includes('/play/end')) return 'dashboard';
  if (pathname.includes('/play/decide')) return 'planning';
  return null;
}
