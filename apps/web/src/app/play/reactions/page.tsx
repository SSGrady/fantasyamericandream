'use client';

import { Suspense } from 'react';
import { LegacyPlayRedirect } from '../../../lib/LegacyPlayRedirect';

export default function ReactionsRedirectPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted">Redirecting…</div>}>
      <LegacyPlayRedirect />
    </Suspense>
  );
}
