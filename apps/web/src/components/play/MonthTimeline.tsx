'use client';

interface MonthTimelineProps {
  months: string[];
  activeIndex: number;
}

export function MonthTimeline({ months, activeIndex }: MonthTimelineProps) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Chapter month timeline">
      {months.map((month, index) => (
        <li
          key={month}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            index <= activeIndex
              ? 'bg-accent text-white'
              : 'border border-border bg-card text-muted'
          }`}
        >
          {month}
        </li>
      ))}
    </ol>
  );
}

export function chapterMonthsFromAsOf(asOf: string): string[] {
  const end = new Date(`${asOf}T00:00:00Z`);
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCMonth(d.getUTCMonth() - i);
    months.push(d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }));
  }
  return months;
}
