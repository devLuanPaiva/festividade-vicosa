import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { deleteTeamAction, updateTeamAction } from '../actions/team-actions';
import { categoryPath } from '../lib/admin-team-paths';
import { getTeamWithGroups } from '../services/get-team-form-data';
import { TeamForm } from './TeamForm';
import { CategoryPageHeader } from './CategoryPageHeader';

interface EditTeamLoaderProps {
  params: Promise<{ teamId: string }>;
}

export async function EditTeamLoader({ params }: EditTeamLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  const { teamId } = await params;
  const { team, category, groups } = await orNotFound(getTeamWithGroups(teamId));
  const target = { teamId: team.id, categoryId: category.id };
  return (
    <>
      <CategoryPageHeader
        categoryId={category.id}
        categoryTitle={categoryLabel(category)}
        title={team.name}
      />
      <TeamForm
        action={updateTeamAction.bind(null, target)}
        initialValues={{
          name: team.name,
          city: team.city,
          abbreviation: team.abbreviation ?? '',
          groupId: team.groupId ?? '',
        }}
        groups={groups}
        cancelHref={categoryPath(category.id)}
        submitLabel="Salvar alterações"
      />
      <section
        aria-labelledby="delete-team-title"
        className="flex items-center justify-between gap-3 border-t border-admin-line pt-5"
      >
        <div className="flex flex-col gap-1">
          <h2 id="delete-team-title" className="font-bold">
            Excluir time
          </h2>
          <p className="text-sm text-admin-muted">
            Times com partidas não podem ser excluídos: apague as partidas antes.
          </p>
        </div>
        <ConfirmDeleteDialog
          triggerLabel="Excluir time"
          title={`Excluir o time '${team.name}'?`}
          description="Esta ação não pode ser desfeita."
          confirmLabel="Excluir time"
          action={deleteTeamAction.bind(null, target)}
        />
      </section>
    </>
  );
}
