'use client';

import type { V1RunConfig } from '@fad/shared';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { WorldRulesPanel } from './WorldRulesPanel';

interface WorldRulesBottomSheetProps {
  open: boolean;
  onClose: () => void;
  config: V1RunConfig;
  onSave: (config: V1RunConfig) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function WorldRulesBottomSheet({
  open,
  onClose,
  config,
  onSave,
}: WorldRulesBottomSheetProps) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState(config);

  useEffect(() => {
    if (open) {
      setDraft(config);
    }
  }, [open, config]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) return;

      const focusables = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleSave = useCallback(() => {
    onSave(draft);
    onClose();
  }, [draft, onClose, onSave]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close world rules panel"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex shrink-0 flex-col items-center border-b border-border px-4 pb-3 pt-3">
          <div
            className="mb-3 h-1.5 w-12 rounded-full bg-border"
            aria-hidden="true"
          />
          <div className="flex w-full items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-serif text-xl text-ink">
                World rules & module toggles
              </h2>
              <p className="mt-1 text-sm text-muted">
                Fine-tune economy, labor, hazards, and difficulty before you start.
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <WorldRulesPanel config={draft} onConfigChange={setDraft} />
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-border px-4 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
