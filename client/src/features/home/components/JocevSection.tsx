import Link from 'next/link';
import type { ReactElement } from 'react';
import { Section } from '@/features/layout/Section';

export function JocevSection(): ReactElement {
  return (
    <Section tone="sky" id="jocevs" labelledBy="jocev-title">
      <div className="max-w-2xl">
        <h2 id="jocev-title" className="font-display text-5xl md:text-7xl">
          JOCEV’S, a jornada dentro da festa
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Campeonato de futsal e handebol, vôlei de areia e festival cultural. Veja grupos,
          placares, os jogos de hoje e as fotos de cada partida.
        </p>
        <Link
          id="jogos"
          href="/#jogos"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-sun px-7 font-semibold text-brand-900"
        >
          Acompanhar os jogos
        </Link>
      </div>
    </Section>
  );
}
