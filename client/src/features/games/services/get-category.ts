import { fetchApiResult } from '@/lib/api/server-fetch';
import type { Category } from '../types';

export async function getCategory(categoryId: string): Promise<Category | null> {
  try {
    return await fetchApiResult<Category>(`/categories/${categoryId}`);
  } catch {
    return null;
  }
}
