import type { ReactElement } from 'react';
import { LoadingRegion, Skeleton } from '@/components/loading/Skeleton';

export function DashboardSkeleton(): ReactElement {
  return (
    <LoadingRegion label="Carregando o resumo do campeonato" className="flex flex-col gap-6">
      <Skeleton tone="admin" className="h-14 w-64 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} tone="admin" className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton tone="admin" className="h-80 rounded-2xl" />
    </LoadingRegion>
  );
}
