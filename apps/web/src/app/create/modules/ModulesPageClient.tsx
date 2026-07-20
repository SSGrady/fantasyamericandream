'use client';

import {
  V1_DIFFICULTY_OPTIONS,
  V1_HOUSE_POOR_SEVERITY_OPTIONS,
  type V1RunConfig,
} from '@fad/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ModuleToggleSection } from '../../../components/create/ModuleToggleSection';
import { SegmentedControl } from '../../../components/create/SegmentedControl';
import { ToggleRow } from '../../../components/create/ToggleRow';
import { loadCharacterDraft } from '../../../lib/character-draft';
import { loadOrCreateRunConfig, saveRunConfig } from '../../../lib/run-config';

export function ModulesPageClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<V1RunConfig | null>(null);

  useEffect(() => {
    const draft = loadCharacterDraft();
    if (!draft) {
      router.replace('/create');
      return;
    }
    setConfig(loadOrCreateRunConfig());
    setReady(true);
  }, [router]);

  const updateConfig = useCallback((patch: Partial<V1RunConfig>) => {
    setConfig((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveRunConfig(next);
      return next;
    });
  }, []);

  const updateModules = useCallback(
    (updater: (modules: V1RunConfig['modules']) => V1RunConfig['modules']) => {
      setConfig((current) => {
        if (!current) return current;
        const next = { ...current, modules: updater(current.modules) };
        saveRunConfig(next);
        return next;
      });
    },
    [],
  );

  const handleBeginSimulation = () => {
    if (!config) return;
    saveRunConfig(config);
    router.push('/play/briefing');
  };

  if (!ready || !config) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted shadow-sm">
        Loading module settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModuleToggleSection
        title="Economy"
        description="Macro shocks and market variability shape recessions and portfolio swings."
      >
        <ToggleRow
          label="Recessions and depressions"
          description="Regime-switching downturns with correlated layoffs and drawdowns."
          checked={config.modules.economy.recessions}
          onChange={(recessions) =>
            updateModules((modules) => ({
              ...modules,
              economy: { ...modules.economy, recessions },
            }))
          }
        />
        <ToggleRow
          label="S&P return variability"
          description="Wider equity return bands around the baseline calibration."
          checked={config.modules.economy.spVariability}
          onChange={(spVariability) =>
            updateModules((modules) => ({
              ...modules,
              economy: { ...modules.economy, spVariability },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Labor"
        description="Job market friction and layoff waves affect income stability."
      >
        <ToggleRow
          label="Ghost jobs"
          description="Posting-heavy searches with low callback rates."
          checked={config.modules.labor.ghostJobs}
          onChange={(ghostJobs) =>
            updateModules((modules) => ({
              ...modules,
              labor: { ...modules.labor, ghostJobs },
            }))
          }
        />
        <ToggleRow
          label="Mass layoff frequency"
          description="Sector-wide layoff events during macro stress."
          checked={config.modules.labor.massLayoffs}
          onChange={(massLayoffs) =>
            updateModules((modules) => ({
              ...modules,
              labor: { ...modules.labor, massLayoffs },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Life"
        description="Household and relationship events beyond solo finances."
      >
        <ToggleRow
          label="Romance"
          description="Dating milestones and partner-related decisions."
          checked={config.modules.life.romance}
          onChange={(romance) =>
            updateModules((modules) => ({
              ...modules,
              life: { ...modules.life, romance },
            }))
          }
        />
        <ToggleRow
          label="Divorce"
          description="Separation costs and asset division scenarios."
          checked={config.modules.life.divorce}
          onChange={(divorce) =>
            updateModules((modules) => ({
              ...modules,
              life: { ...modules.life, divorce },
            }))
          }
        />
        <ToggleRow
          label="Children"
          description="Childcare, education, and household expansion costs."
          checked={config.modules.life.children}
          onChange={(children) =>
            updateModules((modules) => ({
              ...modules,
              life: { ...modules.life, children },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Hazards"
        description="Environmental and commute disruptions with repair costs."
      >
        <ToggleRow
          label="Weather"
          description="Storms, freezes, and regional disaster exposure."
          checked={config.modules.hazards.weather}
          onChange={(weather) =>
            updateModules((modules) => ({
              ...modules,
              hazards: { ...modules.hazards, weather },
            }))
          }
        />
        <ToggleRow
          label="Transit"
          description="Service outages and delayed commutes."
          checked={config.modules.hazards.transit}
          onChange={(transit) =>
            updateModules((modules) => ({
              ...modules,
              hazards: { ...modules.hazards, transit },
            }))
          }
        />
        <ToggleRow
          label="Traffic"
          description="Congestion spikes affecting time and fuel spend."
          checked={config.modules.hazards.traffic}
          onChange={(traffic) =>
            updateModules((modules) => ({
              ...modules,
              hazards: { ...modules.hazards, traffic },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Housing"
        description="House-poor shocks from maintenance, insurance, and HOA surprises."
      >
        <ToggleRow
          label="House-poor events"
          description="Unexpected housing cost spikes after you own or upgrade."
          checked={config.modules.housing.housePoorEvents}
          onChange={(housePoorEvents) =>
            updateModules((modules) => ({
              ...modules,
              housing: { ...modules.housing, housePoorEvents },
            }))
          }
        />
        {config.modules.housing.housePoorEvents ? (
          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium text-ink">Event frequency</p>
            <SegmentedControl
              options={V1_HOUSE_POOR_SEVERITY_OPTIONS}
              value={config.modules.housing.severity}
              onChange={(severity) =>
                updateModules((modules) => ({
                  ...modules,
                  housing: { ...modules.housing, severity },
                }))
              }
              columns={2}
            />
          </div>
        ) : null}
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Health"
        description="Medical surprises scale with difficulty when enabled."
      >
        <ToggleRow
          label="ER visit frequency"
          description="Emergency room bills and deductible hits by difficulty tier."
          checked={config.modules.health.erVisits}
          onChange={(erVisits) =>
            updateModules((modules) => ({
              ...modules,
              health: { ...modules.health, erVisits },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Gig"
        description="Side-income modules for variable-demand work."
      >
        <ToggleRow
          label="Ride-share fulfillment rate"
          description="Demand swings for delivery and ride-share side gigs."
          checked={config.modules.gig.rideshareFulfillment}
          onChange={(rideshareFulfillment) =>
            updateModules((modules) => ({
              ...modules,
              gig: { ...modules.gig, rideshareFulfillment },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Tax"
        description="Compliance events tied to return complexity, not random punishment."
      >
        <ToggleRow
          label="IRS audits"
          description="Audit risk scales with filing complexity and deductions."
          checked={config.modules.tax.irsAudits}
          onChange={(irsAudits) =>
            updateModules((modules) => ({
              ...modules,
              tax: { ...modules.tax, irsAudits },
            }))
          }
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Difficulty"
        description="Easy, Medium, and Hard adjust tail risk and information access."
      >
        <SegmentedControl
          options={V1_DIFFICULTY_OPTIONS}
          value={config.difficulty}
          onChange={(difficulty) => updateConfig({ difficulty })}
        />
      </ModuleToggleSection>

      <ModuleToggleSection
        title="Hints"
        description="Hardcore mode hides analysis nudges and guardrail copy."
      >
        <ToggleRow
          label="No-hints hardcore"
          description="Disable literacy hints and affordability guardrails."
          checked={!config.hintsEnabled}
          onChange={(noHints) => updateConfig({ hintsEnabled: !noHints })}
        />
      </ModuleToggleSection>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/create"
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-accent/40 hover:text-accent"
        >
          Back to character setup
        </Link>
        <button
          type="button"
          onClick={handleBeginSimulation}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
        >
          Begin simulation
        </button>
      </div>
    </div>
  );
}
