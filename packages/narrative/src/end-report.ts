import type { SimulationEndReason } from '@fad/shared';

export interface EndReportCopy {
  title: string;
  subtitle: string;
}

const END_COPY: Record<SimulationEndReason, EndReportCopy> = {
  voluntary: {
    title: 'Voluntary exit',
    subtitle: 'You chose to stop the simulation and review your path.',
  },
  age_65: {
    title: 'Age 65 milestone',
    subtitle: 'You reached the traditional retirement threshold in this run.',
  },
  coast_fire: {
    title: 'Coast FIRE',
    subtitle: 'Invested assets could coast to retirement without new savings.',
  },
  insolvency: {
    title: 'Insolvency',
    subtitle: 'Liabilities exceeded assets. Emergency mode would apply in a full run.',
  },
  bankruptcy: {
    title: 'Bankruptcy',
    subtitle: 'Debts became unmanageable under current choices.',
  },
};

export function renderEndReportCopy(reason: SimulationEndReason): EndReportCopy {
  return END_COPY[reason];
}

export function renderDemoLimitCopy(): EndReportCopy {
  return {
    title: 'Demo complete',
    subtitle: 'You finished four six-month periods in the V1 preview run.',
  };
}
