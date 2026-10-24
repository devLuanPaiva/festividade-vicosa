import type { ReactElement } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { parseGameFilterParams, type SearchParams } from '../lib/game-filters';
import { getGameMatches } from '../services/get-game-matches';
import { MatchList } from './MatchList';

interface GameMatchesProps {
  searchParams: Promise<SearchParams>;
}

export async function GameMatches({ searchParams }: GameMatchesProps): Promise<ReactElement> {
  const params = parseGameFilterParams(await searchParams);
  const matches = await getGameMatches(params);
  return (
    <div className="flex flex-col gap-10">
      {params.categoryId ? (
        <div>
          <ButtonLink href={`/categorias/${params.categoryId}`} variant="brand">
            Classificação e chaveamento
          </ButtonLink>
        </div>
      ) : null}
      <MatchList matches={matches} scope={params.scope} />
    </div>
  );
}
