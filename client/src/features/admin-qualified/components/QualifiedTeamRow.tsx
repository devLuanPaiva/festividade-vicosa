import type { ReactElement } from 'react';
import type { StandingRow } from '@/features/games/types';
import { PositionInput } from './PositionInput';

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
      <PositionInput
        teamId={row.teamId}
        label={`Posição de ${row.teamName} entre os classificados`}
        defaultValue={defaultPosition}
        onInput={onInput}
      />
    </li>
  );
}
