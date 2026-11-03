import type { Category, Team } from '@/features/games/types';
import type { SubEvent } from '@/features/schedule/types';
import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import type { MatchGroup } from '../types';

const MAX_ITEMS = 1000;

export interface CategoryRoster {
  category: Category;
  subEvent: SubEvent;
  groups: MatchGroup[];
  teams: Team[];
}

export async function getCategoryRoster(categoryId: string): Promise<CategoryRoster> {
  const category = await fetchApiResult<Category>(`/categories/${categoryId}`);
  const [subEvent, groups, teams] = await Promise.all([
    fetchApiResult<SubEvent>(`/sub-events/${category.subEventId}`),
    fetchApiPage<MatchGroup>(`/categories/${categoryId}/groups?limit=${MAX_ITEMS}`),
    fetchApiPage<Team>(`/categories/${categoryId}/teams?limit=${MAX_ITEMS}`),
  ]);
  return { category, subEvent, groups, teams };
}
