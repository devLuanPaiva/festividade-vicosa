import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { EditLiveLoader } from '@/features/admin-live/components/EditLiveLoader';

export const metadata: Metadata = { title: 'Transmissão' };

interface EditLiveRouteProps {
  params: Promise<{ liveId: string }>;
}

export default function EditLiveRoute({ params }: Readonly<EditLiveRouteProps>): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando a transmissão" />}>
      <EditLiveLoader params={params} />
    </Suspense>
  );
}
