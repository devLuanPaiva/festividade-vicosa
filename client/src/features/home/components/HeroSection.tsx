import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import jocevLogo from '@/assets/LOGOTIPOS/jocevs-2026/logotipo-jocevs-2026.png';
import { Section } from '@/features/layout/Section';
import { CountdownPanel } from './CountdownPanel';

const primaryButton =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-7 font-semibold text-brand-900 transition-transform hover:scale-[1.03]';
const secondaryButton =
  'inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-white ring-2 ring-white/70 transition-colors hover:bg-white/15';

export function HeroSection(): ReactElement {
  return (
    <Section tone="sky" labelledBy="hero-title">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="hero-enter order-2 lg:order-1">
          <p className="font-signature text-3xl text-sun md:text-4xl">25 anos de emoções</p>
          <h1
            id="hero-title"
            className="mt-2 font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl"
          >
            A jornada que virou tradição em Viçosa
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Futsal, handebol, cultura e festa. Acompanhe jogos, placares, fotos e a história da
            festividade de dezembro.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#jogos" className={primaryButton}>
              Ver jogos
            </Link>
            <Link href="/#trajetoria" className={secondaryButton}>
              Conhecer a história
            </Link>
          </div>
        </div>
        <div className="hero-enter-delayed order-1 flex flex-col gap-6 lg:order-2">
          <div className="rounded-3xl bg-white p-6 shadow-[0_8px_32px_rgba(7,59,134,0.25)] sm:p-8">
            <Image
              src={jocevLogo}
              alt="JOCEV’S, Jornada Cultural e Esportiva de Viçosa, 25 anos de emoções"
              className="h-auto w-full"
              priority
            />
          </div>
          <CountdownPanel />
        </div>
      </div>
    </Section>
  );
}
