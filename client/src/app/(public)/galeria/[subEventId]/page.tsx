import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { SubEventAlbumsLoader } from '@/features/gallery/components/SubEventAlbumsLoader';

export const metadata: Metadata = {
  title: 'Galeria do evento',
  description: 'Álbuns de fotos do evento, por dia.',
};

interface SubEventAlbumsRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function SubEventAlbumsRoute({ params }: SubEventAlbumsRouteProps): ReactElement {
  return (
    <Suspense fallback={<div className="surface-arena min-h-svh" />}>
      <SubEventAlbumsLoader params={params} />
    </Suspense>
  );
}
