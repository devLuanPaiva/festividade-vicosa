import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { MatchPhotoWall } from '@/features/gallery/components/MatchPhotoWall';
import type { GalleryImage } from '@/features/gallery/types';
import { buildGamesHref, scopeOfStatus } from '../lib/game-filters';
import { getMatchOutcome } from '../lib/match-outcome';
import { categoryLabel, stageLabel } from '../lib/match-labels';
import type { MatchDetail } from '../services/get-match-detail';
import { BestPlayerCard } from './BestPlayerCard';
import { MatchFacts } from './MatchFacts';
import { MatchScoreboard } from './MatchScoreboard';

const UPCOMING_NOTE = 'Em breve';

interface MatchDetailViewProps {
  detail: MatchDetail;
  images: GalleryImage[];
}

export function MatchDetailView({ detail, images }: MatchDetailViewProps): ReactElement {
  const { match, teamA, teamB, category } = detail;
  const outcome = getMatchOutcome(match);
  const bestPlayerTeam = match.bestPlayer?.teamId === teamB.id ? teamB : teamA;
  return (
    <>
      <PageHero
        eyebrow={categoryLabel(category)}
        title={stageLabel(match, detail.groupName ?? undefined)}
      >
        <MatchScoreboard
          teamA={teamA}
          teamB={teamB}
          sideA={outcome.sideA}
          sideB={outcome.sideB}
          note={match.status === 'SCHEDULED' ? UPCOMING_NOTE : outcome.note}
        />
      </PageHero>
      <section aria-label="Informações da partida" className="surface-paper">
        <WaveEdge />
        <Container className="flex flex-col gap-8 py-16 md:py-24">
          <MatchFacts detail={detail} />
          {match.bestPlayer ? (
            <BestPlayerCard player={match.bestPlayer} team={bestPlayerTeam} />
          ) : null}
          <MatchPhotoWall images={images} />
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={`/categorias/${category.id}`}>Classificação da categoria</ButtonLink>
            <ButtonLink
              href={buildGamesHref({ scope: scopeOfStatus(match.status) })}
              variant="brand"
            >
              Ver outros jogos
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
