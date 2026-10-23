import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { PointerSpotlight } from '@/components/motion/PointerSpotlight';
import { Reveal } from '@/components/motion/Reveal';
import { RevealText } from '@/components/motion/RevealText';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { stats } from '../../data/home-content';
import { GiantNumber } from './GiantNumber';
import { StatItem } from './StatItem';

export function StatsSection(): ReactElement {
  return (
    <section
      id="estatisticas"
      aria-labelledby="stats-title"
      className="surface-deep scroll-mt-16 overflow-hidden"
    >
      <WaveEdge />
      <PointerSpotlight>
        <div aria-hidden="true" className="grid-lines absolute inset-0 animate-grid" />
        <GiantNumber />
        <Container className="relative py-24 md:py-32">
          <RevealText
            id="stats-title"
            text="Uma jornada que cresce a cada dezembro"
            className="max-w-3xl font-display text-5xl md:text-7xl"
          />
          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.12} direction="scale">
                <StatItem stat={stat} />
              </Reveal>
            ))}
          </dl>
        </Container>
      </PointerSpotlight>
    </section>
  );
}
