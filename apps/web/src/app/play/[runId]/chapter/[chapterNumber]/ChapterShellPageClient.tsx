'use client';

import { ChapterShell } from '../../../../../components/play/ChapterShell';

interface ChapterShellPageClientProps {
  runId: string;
  chapterNumber: number;
}

export function ChapterShellPageClient({ runId, chapterNumber }: ChapterShellPageClientProps) {
  if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-muted">Invalid chapter number.</div>
    );
  }
  return <ChapterShell runId={runId} chapterNumber={chapterNumber} />;
}
