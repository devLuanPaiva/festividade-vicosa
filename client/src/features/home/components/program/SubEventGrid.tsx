import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Reveal } from '@/components/motion/Reveal';
import type { SubEvent } from '@/features/schedule/types';
import { SubEventCard } from './SubEventCard';

interface SubEventGridProps {
  subEvents: SubEvent[];
}

export function SubEventGrid({ subEvents }: SubEventGridProps): ReactElement {
  if (subEvents.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          tone="dark"
          icon="calendar"
          title="Programação em breve"
          description="A programação completa será publicada em breve. Volte para conferir as datas."
        />
      </div>
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
