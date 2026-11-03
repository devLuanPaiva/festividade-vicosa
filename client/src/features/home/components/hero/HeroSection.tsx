import type { ReactElement } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { SparkleField } from '@/components/ui/SparkleField';
import { CountdownPanel } from './CountdownPanel';
import { HeroParallax } from './HeroParallax';
import { LogoStage } from './LogoStage';
import { ScrollCue } from './ScrollCue';

export function HeroSection(): ReactElement {
  return (
    <section aria-labelledby="hero-title" className="surface-sky min-h-svh overflow-hidden">
      <SparkleField />
      <HeroParallax className="relative z-10 mx-auto grid min-h-svh w-[90%] max-w-(--width-content) items-center gap-10 pb-24 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-signature text-3xl text-sun md:text-4xl">25 anos de emoções</p>
          <RevealText
            as="h1"
            id="hero-title"
            playOnLoad
            delay={0.2}
            text="A jornada que virou tradição em Viçosa"
            className="mt-2 font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl"
          />
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Futsal, handebol, cultura e festa. Acompanhe jogos, placares, fotos e a história da
            festividade de dezembro.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/#modalidades">Ver a JOCEV’S</ButtonLink>
            <ButtonLink href="/#trajetoria" variant="outline">
              Conhecer a história
            </ButtonLink>
          </div>
        </div>
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <LogoStage />
          <CountdownPanel />
        </div>
      </HeroParallax>
      <ScrollCue />
    </section>
  );
}
