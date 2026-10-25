import { fetchApiPage } from '@/lib/api/server-fetch';
import type { Category } from '../types';

export async function getSubEventCategories(subEventId: string): Promise<Category[]> {
  try {
    return await fetchApiPage<Category>(`/sub-events/${subEventId}/categories`);
  } catch {
    return [];
  }
}
