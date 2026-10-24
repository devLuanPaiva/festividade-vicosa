import { fetchApiPage } from '@/lib/api/server-fetch';
import type { SeededTeam } from '../types';

export function getCategorySeeding(categoryId: string): Promise<SeededTeam[]> {
  return fetchApiPage<SeededTeam>(`/categories/${categoryId}/seeding`);
}
