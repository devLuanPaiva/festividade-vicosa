import type { ReactElement } from 'react';
import type { DayColumn } from '../lib/day-columns';

interface DayColumnBarProps {
  column: DayColumn;
  scaleMax: number;
  isTooltipOnRight: boolean;
}

interface Segment {
  key: string;
  value: number;
  className: string;
}

function toSegments({ finalized, scheduled }: DayColumn): Segment[] {
  return [
    { key: 'finalized', value: finalized, className: 'bg-chart-1' },
    { key: 'scheduled', value: scheduled, className: 'bg-chart-2' },
  ].filter((segment) => segment.value > 0);
}

function describe(column: DayColumn): string {
  return `${column.weekday} ${column.dayMonth}: ${column.finalized} finalizadas, ${column.scheduled} agendadas`;
}

export function DayColumnBar({
  column,
  scaleMax,
  isTooltipOnRight,
}: DayColumnBarProps): ReactElement {
  const segments = toSegments(column);
  const tooltipSide = isTooltipOnRight ? 'right-0' : 'left-0';
  return (
    <div className="group relative flex min-w-0 flex-1 flex-col items-center">
      <div
        tabIndex={0}
        role="img"
        aria-label={describe(column)}
        className="flex h-56 w-full max-w-12 flex-col items-center justify-end rounded-t outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span className="mb-1 shrink-0 text-xs font-semibold tabular-nums">{column.total}</span>
        <div
          className="flex w-full shrink-0 flex-col-reverse gap-0.5"
          style={{ height: `${(column.total / scaleMax) * 100}%` }}
        >
          {segments.map((segment, index) => (
            <span
              key={segment.key}
              className={`block ${segment.className} ${index === segments.length - 1 ? 'rounded-t-[4px]' : ''}`}
              style={{ flexGrow: segment.value }}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-admin-muted">
        <span className="block font-semibold capitalize">{column.weekday}</span>
        {column.dayMonth}
      </p>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-2 z-20 hidden w-44 rounded-xl bg-admin-ink p-3 text-xs text-white shadow-lg group-focus-within:block group-hover:block ${tooltipSide}`}
      >
        <p className="font-semibold capitalize">
          {column.weekday} {column.dayMonth}
        </p>
        <p>
          <span className="mr-1 inline-block size-2 rounded-sm bg-chart-1" />
          {column.finalized} finalizadas
        </p>
        <p>
          <span className="mr-1 inline-block size-2 rounded-sm bg-chart-2" />
          {column.scheduled} agendadas
        </p>
      </div>
    </div>
  );
}
