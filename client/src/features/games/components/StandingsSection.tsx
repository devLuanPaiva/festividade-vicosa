import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/motion/Reveal';
import { WaveEdge } from '@/components/ui/WaveEdge';
import type { GroupStandings } from '../types';
import { StandingsTable } from './StandingsTable';

interface StandingsSectionProps {
  groups: GroupStandings[];
}

export function StandingsSection({ groups }: StandingsSectionProps): ReactElement {
  return (
    <section aria-labelledby="standings-title" className="surface-paper">
      <WaveEdge />
      <Container className="py-16 md:py-24">
        <h2 id="standings-title" className="font-display text-5xl text-brand-900 md:text-7xl">
          Classificação
        </h2>
        {groups.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-white p-8 text-center text-ink-soft">
            Os grupos desta categoria ainda não foram definidos.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {groups.map((group, index) => (
              <Reveal key={group.groupId} delay={index * 0.1}>
                <StandingsTable group={group} />
              </Reveal>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-ink-soft">
          J jogos · V vitórias · E empates · D derrotas · SG saldo de gols · Pts pontos. Linhas
          verdes: classificados confirmados. * Os critérios não separaram os times.
        </p>
      </Container>
    </section>
  );
}
