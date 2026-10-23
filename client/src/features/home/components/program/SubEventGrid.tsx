import type { ReactElement } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import type { SubEvent } from '@/features/schedule/types';
import { SubEventCard } from './SubEventCard';

interface SubEventGridProps {
  subEvents: SubEvent[];
}

export function SubEventGrid({ subEvents }: SubEventGridProps): ReactElement {
  if (subEvents.length === 0) {
    return (
      <p className="mt-6 max-w-xl text-white/80">
        A programação completa será publicada em breve. Volte para conferir as datas.
      </p>
    );
  }

  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {subEvents.map((subEvent, index) => (
        <li key={subEvent.id}>
          <Reveal delay={(index % 3) * 0.1} direction="scale">
            <SubEventCard subEvent={subEvent} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
