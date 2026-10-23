import type { ReactElement } from 'react';

const PLACEHOLDER_COUNT = 6;

export function MatchListSkeleton(): ReactElement {
  return (
    <div
      role="status"
      aria-label="Carregando jogos"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-3xl bg-white/80" />
      ))}
    </div>
  );
}
