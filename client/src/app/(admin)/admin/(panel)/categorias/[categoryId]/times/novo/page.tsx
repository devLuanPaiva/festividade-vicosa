import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { NewTeamLoader } from '@/features/admin-teams/components/NewTeamLoader';

export const metadata: Metadata = { title: 'Novo time' };

interface NewTeamRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default function NewTeamRoute({ params }: NewTeamRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando…</p>}>
      <NewTeamLoader params={params} />
    </Suspense>
  );
}
