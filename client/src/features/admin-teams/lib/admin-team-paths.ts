import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';

export function categoryPath(categoryId: string): string {
  return `${ADMIN_CATEGORIES_PATH}/${categoryId}`;
}

export function newTeamPath(categoryId: string): string {
  return `${categoryPath(categoryId)}/times/novo`;
}

export function teamPath(teamId: string): string {
  return `/admin/times/${teamId}`;
}
