import type { ReactElement } from 'react';
import { CategoryPageHeader } from '@/features/admin-teams/components/CategoryPageHeader';
import { getCategoryRoster } from '@/features/admin-teams/services/get-category-roster';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { createMatchAction } from '../actions/match-actions';
import { categoryMatchesPath } from '../lib/admin-match-paths';
import { EMPTY_MATCH_VALUES } from '../types';
import { MatchForm } from './MatchForm';

interface NewMatchLoaderProps {
  params: Promise<{ categoryId: string }>;
}

export async function NewMatchLoader({ params }: NewMatchLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:create')) {
    return <NoPermission action="cadastrar partidas" />;
  }
  const { categoryId } = await params;
  const { category, groups, teams } = await orNotFound(getCategoryRoster(categoryId));
  return (
    <>
      <CategoryPageHeader
        categoryId={category.id}
        categoryTitle={categoryLabel(category)}
        title="Nova partida"
      />
      <MatchForm
        action={createMatchAction.bind(null, category.id)}
        initialValues={EMPTY_MATCH_VALUES}
        groups={groups}
        teams={teams}
        isNewMatch
        canChangeTeams
        cancelHref={categoryMatchesPath(category.id)}
        submitLabel="Salvar partida"
      />
    </>
  );
}
