import { getCategoryMatches } from '@/features/admin-matches/services/get-category-matches';
import type { Match } from '@/features/games/types';
import { getCategoryRoster, type CategoryRoster } from './get-category-roster';

export interface CategoryDetail extends CategoryRoster {
  matches: Match[] | null;
}

export async function getCategoryDetail(
  categoryId: string,
  canManageMatches: boolean,
): Promise<CategoryDetail> {
  const [roster, matches] = await Promise.all([
    getCategoryRoster(categoryId),
    canManageMatches ? getCategoryMatches(categoryId) : null,
  ]);
  return { ...roster, matches };
}
