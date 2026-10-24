import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { groupBracketRounds } from '../lib/group-bracket-rounds';
import type { MatchListItem } from '../types';
import { BracketMatchCard } from './BracketMatchCard';

interface BracketSectionProps {
  matches: MatchListItem[];
}

export function BracketSection({ matches }: BracketSectionProps): ReactElement {
  const rounds = groupBracketRounds(matches);
  return (
    <section aria-labelledby="bracket-title" className="surface-deep">
      <WaveEdge />
      <Container className="py-16 md:py-24">
        <h2 id="bracket-title" className="font-display text-5xl md:text-7xl">
          Mata-mata
        </h2>
        {rounds.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-white/10 p-8 text-center text-white/80">
            O chaveamento será definido ao fim da fase de grupos.
          </p>
        ) : (
          <div className="-mx-[5%] mt-8 flex snap-x gap-6 overflow-x-auto px-[5%] pb-4">
            {rounds.map((round) => (
              <div key={round.round} className="w-72 shrink-0 snap-start md:w-80">
                <h3 className="mb-4 font-display text-3xl text-sun">{round.title}</h3>
                <ul className="flex flex-col gap-4">
                  {round.matches.map((match) => (
                    <li key={match.id}>
                      <BracketMatchCard match={match} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
