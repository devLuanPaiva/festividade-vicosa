import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { EditMatchLoader } from '@/features/admin-matches/components/EditMatchLoader';

export const metadata: Metadata = { title: 'Editar partida' };

interface EditMatchRouteProps {
  params: Promise<{ categoryId: string; matchId: string }>;
}

export default function EditMatchRoute({ params }: EditMatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando a partida" count={5} />}>
      <EditMatchLoader params={params} />
    </Suspense>
  );
}
