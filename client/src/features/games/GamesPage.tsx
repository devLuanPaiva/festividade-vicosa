import { Suspense, type ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { GALLERY_PATH } from '@/features/gallery/lib/gallery-paths';
import { GameFiltersFromUrl } from './components/GameFiltersFromUrl';
import { GameMatches } from './components/GameMatches';
import { MatchListSkeleton } from './components/MatchListSkeleton';
import type { SearchParams } from './lib/game-filters';

interface GamesPageProps {
  searchParams: Promise<SearchParams>;
}

export function GamesPage({ searchParams }: Readonly<GamesPageProps>): ReactElement {
  return (
    <>
      <PageHero
        eyebrow="JOCEV’S 2026"
        title="Jogos e resultados"
        description="Futsal e handebol: o que vem aí, o que já aconteceu e quem está na frente."
      >
        <div className="mt-8">
          <ButtonLink href={GALLERY_PATH} variant="outline">
            Ver galeria de fotos
          </ButtonLink>
        </div>
        <Suspense fallback={null}>
          <GameFiltersFromUrl searchParams={searchParams} />
        </Suspense>
      </PageHero>
      <section aria-label="Lista de jogos" className="surface-paper">
        <WaveEdge />
        <Container className="py-16 md:py-24">
          <Suspense fallback={<MatchListSkeleton />}>
            <GameMatches searchParams={searchParams} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
