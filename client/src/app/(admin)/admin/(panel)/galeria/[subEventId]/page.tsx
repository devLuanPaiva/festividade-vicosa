import type { Metadata } from 'next';
import { AdminLinksSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventDaysLoader } from '@/features/admin-gallery/components/SubEventDaysLoader';

export const metadata: Metadata = { title: 'Galeria do sub-evento' };

interface SubEventGalleryRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function SubEventGalleryRoute({ params }: SubEventGalleryRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminLinksSkeleton label="Carregando os dias" />}>
      <SubEventDaysLoader params={params} />
    </Suspense>
  );
}
