import type { ReactElement } from 'react';

const PULSE_CLASS = 'animate-pulse rounded-2xl bg-admin-line motion-reduce:animate-none';

export function DashboardSkeleton(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando o resumo do campeonato"
      className="flex flex-col gap-6"
    >
      <div className={`${PULSE_CLASS} h-14 w-64`} />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={`${PULSE_CLASS} h-28`} />
        ))}
      </div>
      <div className={`${PULSE_CLASS} h-80`} />
    </div>
  );
}
