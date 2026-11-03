import type { ReactElement } from 'react';
import type { GroupStandings, StandingRow } from '../types';

const COLUMNS = ['J', 'V', 'E', 'D', 'SG'] as const;
const HIDDEN_ON_MOBILE = new Set<string>(['E', 'D']);

function columnClassName(column: string): string {
  return HIDDEN_ON_MOBILE.has(column) ? 'hidden sm:table-cell' : '';
}

function cellsOf(row: StandingRow): number[] {
  return [row.played, row.wins, row.draws, row.losses, row.goalDifference];
}

interface StandingRowViewProps {
  row: StandingRow;
}

function StandingRowView({ row }: StandingRowViewProps): ReactElement {
  const qualified = row.qualifiedPosition !== null;
  return (
    <tr className={`border-t border-paper ${qualified ? 'bg-grass/15' : ''}`}>
      <td className="py-3 pl-4 font-display text-xl text-brand-900">
        {row.position}
        {row.tied ? <span title="Critérios não separaram os times">*</span> : null}
      </td>
      <th scope="row" className="max-w-0 truncate py-3 pr-2 text-left font-semibold">
        {row.teamName}
        {qualified ? <span className="sr-only"> (classificado)</span> : null}
      </th>
      {cellsOf(row).map((value, index) => (
        <td
          key={COLUMNS[index]}
          className={`py-3 text-center tabular-nums ${columnClassName(COLUMNS[index] ?? '')}`}
        >
          {value}
        </td>
      ))}
      <td className="py-3 pr-4 text-right font-display text-xl tabular-nums text-brand-900">
        {row.points}
      </td>
    </tr>
  );
}

interface StandingsTableProps {
  group: GroupStandings;
}

export function StandingsTable({ group }: StandingsTableProps): ReactElement {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(7,59,134,0.12)]">
      <table className="w-full text-sm text-ink">
        <caption className="bg-brand-900 px-5 py-3 text-left font-display text-3xl text-white">
          Grupo {group.groupName}
        </caption>
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ink-soft">
            <th scope="col" className="w-10 py-3 pl-4 text-left">
              #
            </th>
            <th scope="col" className="py-3 text-left">
              Time
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className={`w-8 py-3 text-center ${columnClassName(column)}`}
              >
                {column}
              </th>
            ))}
            <th scope="col" className="w-12 py-3 pr-4 text-right">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row) => (
            <StandingRowView key={row.teamId} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
