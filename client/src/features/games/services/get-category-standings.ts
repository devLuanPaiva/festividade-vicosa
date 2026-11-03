import { fetchApiPage } from '@/lib/api/server-fetch';
import type { GroupStandings } from '../types';

export async function getCategoryStandings(categoryId: string): Promise<GroupStandings[]> {
  try {
    return await fetchApiPage<GroupStandings>(`/categories/${categoryId}/standings`);
  } catch {
    return [];
  }
}
