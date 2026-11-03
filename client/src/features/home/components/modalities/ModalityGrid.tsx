import type { ReactElement } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import type { SubEvent } from '@/features/schedule/types';
import { modalities } from '../../data/home-content';
import { hrefOfType } from '../../lib/sub-event-href';
import { ModalityCard } from './ModalityCard';

interface ModalityGridProps {
  subEvents: SubEvent[];
}

export function ModalityGrid({ subEvents }: ModalityGridProps): ReactElement {
  return (
    <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {modalities.map((modality, index) => (
        <li key={modality.name}>
          <Reveal delay={index * 0.1} className="h-full">
            <TiltCard className="h-full">
              <ModalityCard modality={modality} href={hrefOfType(modality.type, subEvents)} />
            </TiltCard>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
