import type { ReactElement } from 'react';
import { parseGameFilterParams, type SearchParams } from '../lib/game-filters';
import { GameFilters } from './GameFilters';

interface GameFiltersFromUrlProps {
  searchParams: Promise<SearchParams>;
}

export async function GameFiltersFromUrl({
  searchParams,
}: GameFiltersFromUrlProps): Promise<ReactElement> {
  return <GameFilters params={parseGameFilterParams(await searchParams)} />;
}
