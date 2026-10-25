import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { EditTeamLoader } from '@/features/admin-teams/components/EditTeamLoader';

export const metadata: Metadata = { title: 'Editar time' };

interface EditTeamRouteProps {
  params: Promise<{ teamId: string }>;
}

export default function EditTeamRoute({ params }: EditTeamRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o time" />}>
      <EditTeamLoader params={params} />
    </Suspense>
  );
}
