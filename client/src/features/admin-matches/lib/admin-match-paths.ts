import { categoryPath, categoryTabPath } from '@/features/admin-teams/lib/admin-team-paths';

export function categoryMatchesPath(categoryId: string): string {
  return categoryTabPath(categoryId, 'partidas');
}

export function newMatchPath(categoryId: string): string {
  return `${categoryPath(categoryId)}/partidas/nova`;
}

export function editMatchPath(categoryId: string, matchId: string): string {
  return `${categoryPath(categoryId)}/partidas/${matchId}`;
}
