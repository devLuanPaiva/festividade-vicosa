import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { EditTeamLoader } from '@/features/admin-teams/components/EditTeamLoader';

export const metadata: Metadata = { title: 'Editar time' };

interface EditTeamRouteProps {
  params: Promise<{ teamId: string }>;
}

export default function EditTeamRoute({ params }: EditTeamRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando time…</p>}>
      <EditTeamLoader params={params} />
    </Suspense>
  );
}
