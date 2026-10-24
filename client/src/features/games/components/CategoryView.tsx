import type { ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { SubEvent } from '@/features/schedule/types';
import { buildGamesHref, modalitySlugOfType } from '../lib/game-filters';
import { categoryLabel } from '../lib/match-labels';
import type { Category, GroupStandings, MatchListItem } from '../types';
import { BracketSection } from './BracketSection';
import { StandingsSection } from './StandingsSection';

interface CategoryViewProps {
  category: Category;
  subEvent: SubEvent | undefined;
  standings: GroupStandings[];
  knockoutMatches: MatchListItem[];
}

export function CategoryView({
  category,
  subEvent,
  standings,
  knockoutMatches,
}: CategoryViewProps): ReactElement {
  const modality = subEvent ? modalitySlugOfType(subEvent.type) : undefined;
  return (
    <>
      <PageHero eyebrow={subEvent?.name ?? 'JOCEV’S 2026'} title={categoryLabel(category)}>
        <div className="mt-8">
          <ButtonLink
            href={buildGamesHref({ modality, categoryId: category.id, scope: 'proximos' })}
          >
            Ver jogos da categoria
          </ButtonLink>
        </div>
      </PageHero>
      <StandingsSection groups={standings} />
      <BracketSection matches={knockoutMatches} />
    </>
  );
}
