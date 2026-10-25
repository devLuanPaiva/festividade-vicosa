import type { ReactElement } from 'react';
import { LoadingRegion, Skeleton } from '@/components/loading/Skeleton';

const PLACEHOLDER_COUNT = 6;

export function MatchListSkeleton(): ReactElement {
  return (
    <LoadingRegion label="Carregando jogos" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <div
          key={index}
          className="flex h-40 flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(7,59,134,0.1)]"
        >
          <Skeleton className="h-4 w-1/2 rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-5/6 rounded-full" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}
