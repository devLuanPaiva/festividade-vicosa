import type { Category, Team } from '@/features/games/types';
import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import type { MatchGroup } from '../types';

const MAX_GROUPS = 100;

export interface CategoryWithGroups {
  category: Category;
  groups: MatchGroup[];
}

export interface TeamWithGroups extends CategoryWithGroups {
  team: Team;
}

export async function getCategoryWithGroups(categoryId: string): Promise<CategoryWithGroups> {
  const [category, groups] = await Promise.all([
    fetchApiResult<Category>(`/categories/${categoryId}`),
    fetchApiPage<MatchGroup>(`/categories/${categoryId}/groups?limit=${MAX_GROUPS}`),
  ]);
  return { category, groups };
}

export async function getTeamWithGroups(teamId: string): Promise<TeamWithGroups> {
  const team = await fetchApiResult<Team>(`/teams/${teamId}`);
  return { team, ...(await getCategoryWithGroups(team.categoryId)) };
}
