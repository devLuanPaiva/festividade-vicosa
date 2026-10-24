import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { NewMatchLoader } from '@/features/admin-matches/components/NewMatchLoader';

export const metadata: Metadata = { title: 'Nova partida' };

interface NewMatchRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default function NewMatchRoute({ params }: NewMatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando…</p>}>
      <NewMatchLoader params={params} />
    </Suspense>
  );
}
