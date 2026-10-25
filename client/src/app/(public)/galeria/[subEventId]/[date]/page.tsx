import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { DayAlbumLoader } from '@/features/gallery/components/DayAlbumLoader';

export const metadata: Metadata = {
  title: 'Álbum do dia',
  description: 'Fotos do dia na festividade de Viçosa.',
};

interface DayAlbumRouteProps {
  params: Promise<{ subEventId: string; date: string }>;
}

export default function DayAlbumRoute({ params }: DayAlbumRouteProps): ReactElement {
  return (
    <Suspense fallback={<div className="surface-arena min-h-svh" />}>
      <DayAlbumLoader params={params} />
    </Suspense>
  );
}
