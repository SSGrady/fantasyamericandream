import type { ChapterPhase } from './chapter-machine.js';

/** Map chapter phase to primary Next.js route. */
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
