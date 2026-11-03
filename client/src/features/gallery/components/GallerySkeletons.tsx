import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { CardGridSkeleton, PhotoGridSkeleton } from '@/components/loading/CardGridSkeleton';
import { LoadingRegion } from '@/components/loading/Skeleton';
import { WaveEdge } from '@/components/ui/WaveEdge';

export function AlbumSectionSkeleton(): ReactElement {
  return (
    <LoadingRegion label="Carregando os álbuns">
      <section className="surface-paper">
        <WaveEdge />
        <Container className="py-16 md:py-24">
          <CardGridSkeleton withImage />
        </Container>
      </section>
    </LoadingRegion>
  );
}

export function AlbumCardsSkeleton(): ReactElement {
  return <CardGridSkeleton withImage />;
}

export function DayPhotosSkeleton(): ReactElement {
  return <PhotoGridSkeleton />;
}
