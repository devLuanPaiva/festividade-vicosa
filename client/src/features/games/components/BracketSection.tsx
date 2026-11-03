import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { buildBracket } from '../lib/build-bracket-tree';
import { roundLabel } from '../lib/match-labels';
import type { MatchListItem } from '../types';
import { BracketExtraMatches } from './BracketExtraMatches';
import { BracketTree } from './BracketTree';

interface BracketSectionProps {
  matches: MatchListItem[];
}

export function BracketSection({ matches }: BracketSectionProps): ReactElement {
  const { tree, thirdPlace, others } = buildBracket(matches);
  const isEmpty = !tree && !thirdPlace && others.length === 0;
  return (
    <section aria-labelledby="bracket-title" className="surface-deep">
      <WaveEdge />
      <Container className="py-16 md:py-24">
        <h2 id="bracket-title" className="font-display text-5xl md:text-7xl">
          Mata-mata
        </h2>
        {isEmpty ? (
          <p className="mt-6 rounded-3xl bg-white/10 p-8 text-center text-white/80">
            O chaveamento será definido ao fim da fase de grupos.
          </p>
        ) : null}
        {tree ? (
          <>
            <p className="mt-6 text-sm text-white/70 md:hidden">
              Deslize para os lados para ver a chave completa.
            </p>
            <BracketTree tree={tree} />
          </>
        ) : null}
        <BracketExtraMatches
          title={roundLabel('THIRD_PLACE')}
          matches={thirdPlace ? [thirdPlace] : []}
        />
        <BracketExtraMatches title="Outras partidas do mata-mata" matches={others} />
      </Container>
    </section>
  );
}
