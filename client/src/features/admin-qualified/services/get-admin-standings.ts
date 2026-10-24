import type { GroupStandings } from '@/features/games/types';
import { fetchApiPage } from '@/lib/api/server-fetch';

export function getAdminStandings(categoryId: string, token: string): Promise<GroupStandings[]> {
  return fetchApiPage<GroupStandings>(`/categories/${categoryId}/standings`, token);
}
