import { fetchApiResult } from '@/lib/api/server-fetch';
import type { Category, Match, Team } from '../types';

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

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
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
  try {
    return await fetchMatchDetail(matchId);
  } catch {
    return null;
  }
}
