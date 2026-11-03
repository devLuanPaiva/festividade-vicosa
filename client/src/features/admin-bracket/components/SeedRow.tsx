import type { ReactElement } from 'react';
import { PositionInput } from '@/features/admin-qualified/components/PositionInput';
import type { SeededTeam } from '../types';

interface SeedRowProps {
  team: SeededTeam;
  defaultSeed: string;
  onInput: () => void;
}

export function SeedRow({ team, defaultSeed, onInput }: SeedRowProps): ReactElement {
  return (
    <li className="flex min-h-16 items-center gap-3 px-4 py-2">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{team.teamName}</span>
        <span className="text-sm text-admin-muted">
          Grupo {team.groupName} · {team.qualifiedPosition}º do grupo
        </span>
      </span>
      <PositionInput
        teamId={team.teamId}
        label={`Cabeça de chave de ${team.teamName}`}
        defaultValue={defaultSeed}
        onInput={onInput}
      />
    </li>
  );
}
