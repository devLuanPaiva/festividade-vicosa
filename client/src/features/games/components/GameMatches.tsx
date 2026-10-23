import type { ReactElement } from 'react';
import { parseGameFilterParams, type SearchParams } from '../lib/game-filters';
import { getGameMatches } from '../services/get-game-matches';
import { MatchList } from './MatchList';

interface GameMatchesProps {
  searchParams: Promise<SearchParams>;
}

export async function GameMatches({ searchParams }: GameMatchesProps): Promise<ReactElement> {
  const params = parseGameFilterParams(await searchParams);
  const matches = await getGameMatches(params);
  return <MatchList matches={matches} scope={params.scope} />;
}
