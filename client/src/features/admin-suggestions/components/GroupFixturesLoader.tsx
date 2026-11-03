import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { CategoryPageHeader } from '@/features/admin-teams/components/CategoryPageHeader';
import { getCategoryRoster } from '@/features/admin-teams/services/get-category-roster';
import { categoryMatchesPath } from '@/features/admin-matches/lib/admin-match-paths';
import { categoryLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { toGroupFixtureRows } from '../lib/suggestion-rows';
import { toTeamSelectOptions } from '../lib/team-options';
import { getGroupFixtureSuggestions } from '../services/get-suggestions';
import { SuggestionReviewForm } from './SuggestionReviewForm';

interface GroupFixturesLoaderProps {
  params: Promise<{ categoryId: string; groupId: string }>;
}

export async function GroupFixturesLoader({
  params,
}: GroupFixturesLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:create')) {
    return <NoPermission action="cadastrar partidas" />;
  }
  const { categoryId, groupId } = await params;
  const roster = await orNotFound(getCategoryRoster(categoryId));
  const group = roster.groups.find((candidate) => candidate.id === groupId);
  const suggestions = group ? await orNotFound(getGroupFixtureSuggestions(groupId)) : [];
  const returnPath = categoryMatchesPath(categoryId);
  return (
    <>
      <CategoryPageHeader
        categoryId={categoryId}
        categoryTitle={categoryLabel(roster.category)}
        title={`Sugestão de jogos do Grupo ${group?.name ?? ''}`.trim()}
      />
      {suggestions.length === 0 ? (
        <EmptyState
          tone="admin"
          icon="calendar"
          title="Nada a sugerir"
          description="Todos os confrontos deste grupo já têm partida, ou o grupo ainda não tem times suficientes."
        />
      ) : (
        <SuggestionReviewForm
          target={{ categoryId, returnPath }}
          rows={toGroupFixtureRows(suggestions, groupId)}
          teamOptions={toTeamSelectOptions(roster.teams.filter((team) => team.groupId === groupId))}
          submitLabel="Criar partidas marcadas"
        />
      )}
    </>
  );
}
