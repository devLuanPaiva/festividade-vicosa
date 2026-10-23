import type { ReactElement, ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { RevealText } from '@/components/motion/RevealText';
import { WaveEdge } from '@/components/ui/WaveEdge';

interface ProgramSectionProps {
  children: ReactNode;
}

export function ProgramSection({ children }: ProgramSectionProps): ReactElement {
  return (
    <section id="programacao" aria-labelledby="program-title" className="surface-deep scroll-mt-16">
      <WaveEdge />
      <Container className="py-20 md:py-28">
        <RevealText
          id="program-title"
          text="Programação de dezembro"
          className="font-display text-6xl md:text-8xl"
        />
        {children}
      </Container>
    </section>
  );
}
