import { cacheLife, cacheTag } from 'next/cache';
import { ApiError } from '@/lib/api/api-response';
import { fetchApiResult } from '@/lib/api/server-fetch';
import type { Category, Match, Team } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };

export interface MatchDetail {
  match: Match;
  teamA: Team;
  teamB: Team;
  category: Category;
  groupName: string | null;
}

async function fetchGroupName(groupId: string | null): Promise<string | null> {
  if (!groupId) {
    return null;
  }
  const group = await fetchApiResult<{ name: string }>(`/groups/${groupId}`);
  return group.name;
}

async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
  const match = await fetchApiResult<Match>(`/matches/${matchId}`);
  const [teamA, teamB, category, groupName] = await Promise.all([
    fetchApiResult<Team>(`/teams/${match.teamAId}`),
    fetchApiResult<Team>(`/teams/${match.teamBId}`),
    fetchApiResult<Category>(`/categories/${match.categoryId}`),
    fetchGroupName(match.groupId),
  ]);
  return { match, teamA, teamB, category, groupName };
}

export async function getMatchDetail(matchId: string): Promise<MatchDetail | null> {
  'use cache';
  cacheTag('matches', `match-${matchId}`);

  try {
    cacheLife('seconds');
    return await fetchMatchDetail(matchId);
  } catch (error) {
    if (!(error instanceof ApiError && error.statusCode < 500)) {
      cacheLife(UNAVAILABLE_CACHE_LIFE);
    }
    return null;
  }
}
