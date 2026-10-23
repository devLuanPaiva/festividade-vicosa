import type { ReactElement } from 'react';
import { Section } from '@/features/layout/Section';
import { milestones } from '../data/milestones.mock';
import { PhotoPlaceholder } from './PhotoPlaceholder';

export function TrajectorySection(): ReactElement {
  return (
    <Section tone="deep" id="trajetoria" labelledBy="trajectory-title">
      <h2 id="trajectory-title" className="font-display text-5xl md:text-7xl">
        25 anos de história
      </h2>
      <p className="mt-3 max-w-xl text-white/80">
        Uma jornada que começou na quadra e hoje movimenta a cidade inteira.
      </p>
      <ol className="relative mt-12 space-y-12 border-l-2 border-sun/60 pl-6 md:pl-10">
        {milestones.map((milestone) => (
          <li key={milestone.year} className="relative grid gap-5 md:grid-cols-2 md:gap-10">
            <span
              aria-hidden="true"
              className="absolute -left-[33px] top-3 size-4 rotate-45 bg-sun md:-left-[49px]"
            />
            <div>
              <p className="font-display text-6xl leading-none text-sun md:text-7xl">
                {milestone.year}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{milestone.title}</h3>
              <p className="mt-2 max-w-md text-white/80">{milestone.description}</p>
            </div>
            <PhotoPlaceholder caption={`${milestone.title}, ${milestone.year}`} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
