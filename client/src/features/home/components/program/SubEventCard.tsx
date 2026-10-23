import type { ReactElement } from 'react';
import { formatDateRange } from '@/features/schedule/lib/format-date-range';
import type { SubEvent } from '@/features/schedule/types';

interface SubEventCardProps {
  subEvent: SubEvent;
}

export function SubEventCard({ subEvent }: SubEventCardProps): ReactElement {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl bg-white p-6 text-ink shadow-[0_14px_36px_rgba(3,20,70,0.35)] transition-transform duration-300 hover:-translate-y-2">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-sun/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
      />
      <p className="relative inline-block rounded-full bg-sun px-4 py-1 font-display text-2xl text-brand-900">
        {formatDateRange(subEvent.startDate, subEvent.endDate)}
      </p>
      <h3 className="relative mt-4 text-xl font-semibold text-brand-900">{subEvent.name}</h3>
      {subEvent.location ? (
        <p className="relative mt-1 text-sm text-ink-soft">{subEvent.location}</p>
      ) : null}
    </article>
  );
}
