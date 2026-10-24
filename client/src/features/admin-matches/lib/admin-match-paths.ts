import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { categoryPath, categoryTabPath } from '@/features/admin-teams/lib/admin-team-paths';

export function categoryMatchesPath(categoryId: string): string {
  return categoryTabPath(categoryId, 'partidas');
}

export const CHOOSE_CATEGORY_FOR_MATCH_PATH = `${ADMIN_MATCHES_PATH}/nova`;

export function newMatchPath(categoryId: string): string {
  return `${categoryPath(categoryId)}/partidas/nova`;
}

export function editMatchPath(categoryId: string, matchId: string): string {
  return `${categoryPath(categoryId)}/partidas/${matchId}`;
}
