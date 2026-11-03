import type { ReactElement, ReactNode } from 'react';
import { Section } from '@/components/layout/Section';
import { RevealText } from '@/components/motion/RevealText';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { buildGamesHref } from '@/features/games/lib/game-filters';

interface ModalitiesSectionProps {
  children: ReactNode;
}

export function ModalitiesSection({ children }: ModalitiesSectionProps): ReactElement {
  return (
    <Section tone="arena" id="modalidades" labelledBy="modalities-title">
      <RevealText
        id="modalities-title"
        text="JOCEV’S, a jornada dentro da festa"
        className="max-w-3xl font-display text-6xl md:text-8xl"
      />
      <p className="mt-4 max-w-xl text-lg text-white/90">
        Campeonato de futsal e handebol, vôlei de areia e festival cultural. Em breve, grupos,
        placares e fotos de cada partida.
      </p>
      {children}
      <p className="mt-8 text-sm font-semibold text-sun">
        Toque em um card para ir direto à página daquela modalidade.
      </p>
      <div className="mt-6">
        <ButtonLink href={buildGamesHref({ scope: 'proximos' })}>Ver jogos</ButtonLink>
      </div>
    </Section>
  );
}
