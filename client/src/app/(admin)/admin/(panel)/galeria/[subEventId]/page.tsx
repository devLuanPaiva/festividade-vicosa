import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { SubEventDaysLoader } from '@/features/admin-gallery/components/SubEventDaysLoader';

export const metadata: Metadata = { title: 'Galeria do sub-evento' };

interface SubEventGalleryRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function SubEventGalleryRoute({ params }: SubEventGalleryRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando os dias…</p>}>
      <SubEventDaysLoader params={params} />
    </Suspense>
  );
}
