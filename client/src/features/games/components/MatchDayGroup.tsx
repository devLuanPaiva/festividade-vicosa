import type { ReactElement } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import type { MatchDay } from '../lib/group-matches-by-day';
import { MatchCard } from './MatchCard';

interface MatchDayGroupProps {
  day: MatchDay;
}

export function MatchDayGroup({ day }: MatchDayGroupProps): ReactElement {
  return (
    <section aria-labelledby={`day-${day.key}`}>
      <Reveal direction="left">
        <h2
          id={`day-${day.key}`}
          className="font-display text-4xl capitalize text-brand-900 md:text-5xl"
        >
          {day.heading}
        </h2>
      </Reveal>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {day.matches.map((match, index) => (
          <li key={match.id}>
            <Reveal delay={Math.min(index, 5) * 0.06} className="h-full">
              <MatchCard match={match} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
