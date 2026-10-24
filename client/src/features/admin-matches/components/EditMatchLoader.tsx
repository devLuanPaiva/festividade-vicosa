import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { CategoryPageHeader } from '@/features/admin-teams/components/CategoryPageHeader';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { updateMatchAction } from '../actions/match-actions';
import { categoryMatchesPath } from '../lib/admin-match-paths';
import { toMatchFormValues } from '../lib/match-form-values';
import { getMatchFormData } from '../services/get-match-form-data';
import { DeleteMatchSection } from './DeleteMatchSection';
import { MatchForm } from './MatchForm';

interface EditMatchLoaderProps {
  params: Promise<{ categoryId: string; matchId: string }>;
}

export async function EditMatchLoader({ params }: EditMatchLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:create')) {
    return <NoPermission action="cadastrar partidas" />;
  }
  const { categoryId, matchId } = await params;
  const { match, category, groups, teams } = await orNotFound(getMatchFormData(matchId));
  if (match.categoryId !== categoryId) {
    notFound();
  }
  const canChangeTeams = match.status === 'SCHEDULED';
  const target = { matchId: match.id, categoryId: category.id, canChangeTeams };
  const groupName = groups.find((group) => group.id === match.groupId)?.name;
  return (
    <>
      <CategoryPageHeader
        categoryId={category.id}
        categoryTitle={categoryLabel(category)}
        title={stageLabel(match, groupName)}
      />
      <MatchForm
        action={updateMatchAction.bind(null, target)}
        initialValues={toMatchFormValues(match)}
        groups={groups}
        teams={teams}
        isNewMatch={false}
        canChangeTeams={canChangeTeams}
        cancelHref={categoryMatchesPath(category.id)}
        submitLabel="Salvar alterações"
      />
      <DeleteMatchSection target={target} />
    </>
  );
}
