import { Suspense } from 'react';
import { ChapterShellPageClient } from './ChapterShellPageClient';

interface ChapterPageProps {
  params: Promise<{ runId: string; chapterNumber: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { runId, chapterNumber } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-muted">Loading chapter…</div>}>
      <ChapterShellPageClient runId={runId} chapterNumber={Number(chapterNumber)} />
    </Suspense>
  );
}
