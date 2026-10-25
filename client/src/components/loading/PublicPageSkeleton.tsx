import type { ReactElement, ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { LoadingRegion, Skeleton } from './Skeleton';

interface PublicPageSkeletonProps {
  label: string;
  children: ReactNode;
}

export function PublicPageSkeleton({ label, children }: PublicPageSkeletonProps): ReactElement {
  return (
    <LoadingRegion label={label}>
      <section className="surface-arena overflow-hidden">
        <Container className="flex flex-col gap-4 pb-24 pt-32 md:pb-32 md:pt-40">
          <Skeleton tone="dark" className="h-8 w-40 rounded-full" />
          <Skeleton tone="dark" className="h-16 w-3/4 max-w-xl rounded-2xl md:h-24" />
          <Skeleton tone="dark" className="h-5 w-full max-w-md rounded-full" />
        </Container>
      </section>
      <section className="surface-paper">
        <WaveEdge />
        <Container className="py-16 md:py-24">{children}</Container>
      </section>
    </LoadingRegion>
  );
}
