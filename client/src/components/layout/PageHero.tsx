import type { ReactElement, ReactNode } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import { SparkleField } from '@/components/ui/SparkleField';
import { Container } from './Container';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps): ReactElement {
  return (
    <section aria-labelledby="page-title" className="surface-arena overflow-hidden">
      <SparkleField />
      <Container className="relative z-10 pb-24 pt-32 md:pb-32 md:pt-40">
        <p className="font-signature text-3xl text-sun md:text-4xl">{eyebrow}</p>
        <RevealText
          as="h1"
          id="page-title"
          playOnLoad
          text={title}
          className="mt-1 font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl"
        />
        {description ? <p className="mt-4 max-w-2xl text-lg text-white/90">{description}</p> : null}
        {children}
      </Container>
    </section>
  );
}
