import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import type { Team } from '@/features/games/types';
import { deleteGroupAction } from '../actions/group-actions';
import type { MatchGroup } from '../types';
import { GroupCreateForm } from './GroupCreateForm';
import { GroupNameEditor } from './GroupNameEditor';

interface GroupsTabProps {
  categoryId: string;
  groups: MatchGroup[];
  teams: Team[];
}

interface GroupRowProps {
  group: MatchGroup;
  teamCount: number;
}

function describeTeamCount(count: number): string {
  return count === 1 ? '1 time' : `${count} times`;
}

function deletionNote(teamCount: number): string {
  const teamsNote =
    teamCount > 0 ? `Os ${describeTeamCount(teamCount)} do grupo ficam sem grupo. ` : '';
  return `${teamsNote}Grupos com partidas não podem ser excluídos.`;
}

function GroupRow({ group, teamCount }: GroupRowProps): ReactElement {
  return (
    <li className="flex items-center gap-2 px-2 py-1">
      <GroupNameEditor key={group.name} groupId={group.id} name={group.name} />
      <span className="shrink-0 text-sm text-admin-muted">{describeTeamCount(teamCount)}</span>
      <ConfirmDeleteDialog
        triggerLabel="Excluir"
        title={`Excluir o grupo '${group.name}'?`}
        description={deletionNote(teamCount)}
        confirmLabel="Excluir grupo"
        action={deleteGroupAction.bind(null, group.id)}
      />
    </li>
  );
}

export function GroupsTab({ categoryId, groups, teams }: GroupsTabProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <GroupCreateForm categoryId={categoryId} />
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {groups.length === 0 ? (
          <section aria-labelledby="no-groups-title" className="flex flex-col gap-1 p-5">
            <h2 id="no-groups-title" className="font-bold">
              Nenhum grupo ainda
            </h2>
            <p className="text-sm text-admin-muted">
              Crie um grupo para organizar os times da fase de grupos, por exemplo Grupo A. Com
              poucos times, um grupo só já basta.
            </p>
          </section>
        ) : (
          <ul className="divide-y divide-admin-line">
            {groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                teamCount={teams.filter((team) => team.groupId === group.id).length}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
