import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { LoadingRegion, Skeleton } from './Skeleton';

export function MatchDetailSkeleton(): ReactElement {
  return (
    <LoadingRegion label="Carregando a partida">
      <section className="surface-arena overflow-hidden">
        <Container className="flex flex-col items-center gap-6 pb-24 pt-32 md:pb-32 md:pt-40">
          <Skeleton tone="dark" className="h-8 w-48 rounded-full" />
          <Skeleton tone="dark" className="h-12 w-72 rounded-2xl md:h-16" />
          <div className="flex w-full max-w-2xl items-center justify-between gap-6">
            <Skeleton tone="dark" className="size-24 rounded-full md:size-32" />
            <Skeleton tone="dark" className="h-20 w-40 rounded-3xl" />
            <Skeleton tone="dark" className="size-24 rounded-full md:size-32" />
          </div>
        </Container>
      </section>
      <section className="surface-paper">
        <WaveEdge />
        <Container className="flex flex-col gap-6 py-16 md:py-24">
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full max-w-lg rounded-3xl" />
        </Container>
      </section>
    </LoadingRegion>
  );
}
