'use client';

import { ReactNode } from 'react';

const STEPS = ['Scenario', 'Identity', 'Balance sheet', 'World rules'] as const;

interface CharacterSetupWizardProps {
  step: number;
  onStepChange: (step: number) => void;
  preview: ReactNode;
  children: ReactNode;
}

export function CharacterSetupWizard({
  step,
  onStepChange,
  preview,
  children,
}: CharacterSetupWizardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-9 space-y-6">
        <ol className="flex flex-wrap gap-2" aria-label="Character setup steps">
          {STEPS.map((label, index) => {
            const stepNumber = index + 1;
            const active = step === stepNumber;
            const done = step > stepNumber;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => onStepChange(stepNumber)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    active
                      ? 'bg-accent text-white'
                      : done
                        ? 'bg-positive/15 text-positive'
                        : 'border border-border bg-card text-muted'
                  }`}
                >
                  {stepNumber}. {label}
                </button>
              </li>
            );
          })}
        </ol>
        {children}
      </div>
      <div className="lg:col-span-3">{preview}</div>
    </div>
  );
}

export { STEPS as CHARACTER_SETUP_STEPS };
