import type { Metadata } from 'next';
import { AdminLinksSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { SubEventDaysLoader } from '@/features/admin-gallery/components/SubEventDaysLoader';

export const metadata: Metadata = { title: 'Galeria por dia' };

interface DaysRouteProps {
  params: Promise<{ subEventId: string }>;
}

export default function DaysRoute({ params }: DaysRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminLinksSkeleton label="Carregando os dias" />}>
      <SubEventDaysLoader params={params} />
    </Suspense>
  );
}
