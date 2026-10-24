import type { ReactElement } from 'react';
import type { Team } from '@/features/games/types';
import type { MatchFormValues } from '../types';

interface MatchFixedTeamsProps {
  values: MatchFormValues;
  teams: Team[];
}

function nameOf(teams: Team[], teamId: string): string {
  return teams.find((team) => team.id === teamId)?.name ?? '';
}

export function MatchFixedTeams({ values, teams }: MatchFixedTeamsProps): ReactElement {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-admin-line bg-admin-surface p-4">
      <input type="hidden" name="teamAId" value={values.teamAId} />
      <input type="hidden" name="teamBId" value={values.teamBId} />
      <p className="font-semibold">
        {nameOf(teams, values.teamAId)} <span className="text-admin-muted">x</span>{' '}
        {nameOf(teams, values.teamBId)}
      </p>
      <p className="text-sm text-admin-muted">
        Partida finalizada: os times não mudam. Data e local ainda podem ser corrigidos.
      </p>
    </div>
  );
}
