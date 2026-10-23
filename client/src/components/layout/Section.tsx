import type { ReactElement, ReactNode } from 'react';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { Container } from './Container';

export type SectionTone = 'sky' | 'arena' | 'splash' | 'deep' | 'paper';

interface SectionProps {
  tone: SectionTone;
  id?: string;
  labelledBy?: string;
  withWave?: boolean;
  children: ReactNode;
}

export function Section({
  tone,
  id,
  labelledBy,
  withWave = false,
  children,
}: SectionProps): ReactElement {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`surface-${tone} scroll-mt-16`}>
      {withWave ? <WaveEdge /> : null}
      <Container className="relative py-20 md:py-28">{children}</Container>
    </section>
  );
}
