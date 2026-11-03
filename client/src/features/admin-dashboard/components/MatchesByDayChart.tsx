import type { ReactElement } from 'react';
import { niceScale } from '../lib/chart-scale';
import type { DayColumn } from '../lib/day-columns';
import { DayColumnBar } from './DayColumnBar';

interface MatchesByDayChartProps {
  columns: DayColumn[];
}

const PLOT_HEIGHT_CLASS = 'h-56';

function Legend(): ReactElement {
  return (
    <ul className="flex flex-wrap gap-4 text-sm text-admin-muted">
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="size-3 rounded-sm bg-chart-1" />
        Finalizadas
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="size-3 rounded-sm bg-chart-2" />
        Agendadas
      </li>
    </ul>
  );
}

function DataTable({ columns }: MatchesByDayChartProps): ReactElement {
  return (
    <table className="sr-only">
      <caption>Partidas por dia</caption>
      <thead>
        <tr>
          <th scope="col">Dia</th>
          <th scope="col">Finalizadas</th>
          <th scope="col">Agendadas</th>
        </tr>
      </thead>
      <tbody>
        {columns.map((column) => (
          <tr key={column.date}>
            <th scope="row">{column.dayMonth}</th>
            <td>{column.finalized}</td>
            <td>{column.scheduled}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MatchesByDayChart({ columns }: MatchesByDayChartProps): ReactElement {
  const scale = niceScale(Math.max(0, ...columns.map((column) => column.total)));
  return (
    <figure className="flex flex-col gap-4 rounded-2xl border border-admin-line bg-admin-surface p-4 sm:p-5">
      <figcaption className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Partidas por dia</h2>
        <Legend />
      </figcaption>
      <div className="relative mt-4">
        <div aria-hidden="true" className={`absolute inset-x-0 top-0 ${PLOT_HEIGHT_CLASS}`}>
          {scale.ticks.map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 border-t border-admin-line"
              style={{ bottom: `${(tick / scale.max) * 100}%` }}
            >
              <span className="absolute -top-2.5 left-0 w-7 text-right text-xs tabular-nums text-admin-muted">
                {tick}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex gap-1 pl-9 sm:gap-2">
          {columns.map((column, index) => (
            <DayColumnBar
              key={column.date}
              column={column}
              scaleMax={scale.max}
              isTooltipOnRight={index >= columns.length / 2}
            />
          ))}
        </div>
      </div>
      <DataTable columns={columns} />
    </figure>
  );
}
