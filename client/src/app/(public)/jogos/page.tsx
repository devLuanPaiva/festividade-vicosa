import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { GamesPage } from '@/features/games/GamesPage';
import type { SearchParams } from '@/features/games/lib/game-filters';

export const metadata: Metadata = {
  title: 'Jogos e resultados',
  description: 'Próximos jogos, placares e resultados do futsal e do handebol da JOCEV’S 2026.',
};

interface GamesRouteProps {
  searchParams: Promise<SearchParams>;
}

export default function GamesRoute({ searchParams }: GamesRouteProps): ReactElement {
  return <GamesPage searchParams={searchParams} />;
}
