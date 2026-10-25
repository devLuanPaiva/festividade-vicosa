import { fetchApiPage } from '@/lib/api/server-fetch';
import { requireSessionToken } from '@/lib/auth/current-user';
import type { BracketMatchSuggestion, FixtureSuggestion } from '../types';

export async function getGroupFixtureSuggestions(groupId: string): Promise<FixtureSuggestion[]> {
  return fetchApiPage<FixtureSuggestion>(
    `/groups/${groupId}/fixture-suggestions`,
    await requireSessionToken(),
  );
}

export async function getNextMatchSuggestions(
  categoryId: string,
): Promise<BracketMatchSuggestion[]> {
  return fetchApiPage<BracketMatchSuggestion>(
    `/categories/${categoryId}/bracket/next-matches`,
    await requireSessionToken(),
  );
}
