import type { ReactElement } from 'react';
import { Section } from '@/features/layout/Section';
import { formatDateRange } from '@/features/schedule/format-date-range';
import type { SubEvent } from '@/features/schedule/schedule-types';

interface ProgramSectionProps {
  subEvents: SubEvent[];
}

function SubEventCard({ subEvent }: { subEvent: SubEvent }): ReactElement {
  return (
    <li className="rounded-2xl border border-brand-500/15 bg-white p-6 shadow-[0_1px_3px_rgba(11,27,61,0.06)]">
      <p className="font-display text-3xl text-brand-500">
        {formatDateRange(subEvent.startDate, subEvent.endDate)}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{subEvent.name}</h3>
      {subEvent.location ? <p className="mt-1 text-sm text-ink-soft">{subEvent.location}</p> : null}
    </li>
  );
}

export function ProgramSection({ subEvents }: ProgramSectionProps): ReactElement {
  return (
    <Section tone="paper" id="programacao" labelledBy="program-title">
      <h2 id="program-title" className="font-display text-5xl text-brand-900 md:text-7xl">
        Programação de dezembro
      </h2>
      {subEvents.length === 0 ? (
        <p className="mt-6 max-w-xl text-ink-soft">
          A programação completa será publicada em breve. Volte para conferir as datas.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subEvents.map((subEvent) => (
            <SubEventCard key={subEvent.id} subEvent={subEvent} />
          ))}
        </ul>
      )}
    </Section>
  );
}
