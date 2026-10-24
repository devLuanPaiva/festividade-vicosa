import type { ReactElement } from 'react';
import type { StandingRow } from '@/features/games/types';
import { POSITION_FIELD_PREFIX } from '../lib/order-teams-by-position';

interface QualifiedTeamRowProps {
  row: StandingRow;
  defaultPosition: string;
  onInput: () => void;
}

function describeRow(row: StandingRow): string {
  const balance = row.goalDifference > 0 ? `+${row.goalDifference}` : `${row.goalDifference}`;
  return `${row.points} pts · ${row.played} J · SG ${balance}`;
}

export function QualifiedTeamRow({
  row,
  defaultPosition,
  onInput,
}: QualifiedTeamRowProps): ReactElement {
  return (
    <li className="flex min-h-16 items-center gap-3 px-4 py-2">
      <span className="w-6 shrink-0 text-center font-bold text-admin-muted">{row.position}º</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{row.teamName}</span>
        <span className="text-sm text-admin-muted">{describeRow(row)}</span>
        {row.tied && row.played > 0 ? (
          <span className="text-sm font-semibold text-brand-700">
            Empatado nos critérios: a equipe técnica decide.
          </span>
        ) : null}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        name={`${POSITION_FIELD_PREFIX}${row.teamId}`}
        defaultValue={defaultPosition}
        onChange={onInput}
        aria-label={`Posição de ${row.teamName} entre os classificados`}
        className="min-h-12 w-20 shrink-0 rounded-xl border border-admin-line bg-white px-2 text-center text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
      />
    </li>
  );
}
