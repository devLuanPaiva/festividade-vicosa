import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { NewMatchLoader } from '@/features/admin-matches/components/NewMatchLoader';

export const metadata: Metadata = { title: 'Nova partida' };

interface NewMatchRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default function NewMatchRoute({ params }: NewMatchRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário da partida" count={5} />}>
      <NewMatchLoader params={params} />
    </Suspense>
  );
}
