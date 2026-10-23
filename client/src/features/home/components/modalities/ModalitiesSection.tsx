import type { ReactElement } from 'react';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { RevealText } from '@/components/motion/RevealText';
import { TiltCard } from '@/components/motion/TiltCard';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { modalities } from '../../data/home-content';
import { ModalityCard } from './ModalityCard';

export function ModalitiesSection(): ReactElement {
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
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modalities.map((modality, index) => (
          <li key={modality.name}>
            <Reveal delay={index * 0.1}>
              <TiltCard>
                <ModalityCard modality={modality} />
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <ButtonLink href="/#programacao">Ver a programação</ButtonLink>
      </div>
    </Section>
  );
}
