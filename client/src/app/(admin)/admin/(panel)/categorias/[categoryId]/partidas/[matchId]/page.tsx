import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { EditMatchLoader } from '@/features/admin-matches/components/EditMatchLoader';

export const metadata: Metadata = { title: 'Editar partida' };

interface EditMatchRouteProps {
  params: Promise<{ categoryId: string; matchId: string }>;
}

export default function EditMatchRoute({ params }: EditMatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando…</p>}>
      <EditMatchLoader params={params} />
    </Suspense>
  );
}
