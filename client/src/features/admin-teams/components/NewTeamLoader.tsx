import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { createTeamAction } from '../actions/team-actions';
import { categoryPath } from '../lib/admin-team-paths';
import { getCategoryWithGroups } from '../services/get-team-form-data';
import { EMPTY_TEAM_VALUES } from '../types';
import { TeamForm } from './TeamForm';
import { CategoryPageHeader } from './CategoryPageHeader';

interface NewTeamLoaderProps {
  params: Promise<{ categoryId: string }>;
}

export async function NewTeamLoader({ params }: NewTeamLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  const { categoryId } = await params;
  const { category, groups } = await orNotFound(getCategoryWithGroups(categoryId));
  return (
    <>
      <CategoryPageHeader
        categoryId={category.id}
        categoryTitle={categoryLabel(category)}
        title="Novo time"
      />
      <TeamForm
        action={createTeamAction.bind(null, category.id)}
        initialValues={EMPTY_TEAM_VALUES}
        groups={groups}
        cancelHref={categoryPath(category.id)}
        submitLabel="Salvar time"
      />
    </>
  );
}
