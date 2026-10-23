import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { RevealText } from '@/components/motion/RevealText';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { milestones } from '../../data/milestones.mock';
import { TrajectoryTimeline } from './TrajectoryTimeline';

export function TrajectorySection(): ReactElement {
  return (
    <section
      id="trajetoria"
      aria-labelledby="trajectory-title"
      className="surface-paper scroll-mt-16"
    >
      <WaveEdge />
      <Container className="py-20 md:py-28">
        <RevealText
          id="trajectory-title"
          text="25 anos de história"
          className="font-display text-6xl text-brand-900 md:text-8xl"
        />
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Uma jornada que começou na quadra e hoje movimenta a cidade inteira.
        </p>
        <TrajectoryTimeline milestones={milestones} />
      </Container>
    </section>
  );
}
