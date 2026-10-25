import { categoryPath } from '@/features/admin-teams/lib/admin-team-paths';

export function groupFixturesPath(categoryId: string, groupId: string): string {
  return `${categoryPath(categoryId)}/sugestoes/grupo/${groupId}`;
}
