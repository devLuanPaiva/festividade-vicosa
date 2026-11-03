import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { NewTeamLoader } from '@/features/admin-teams/components/NewTeamLoader';

export const metadata: Metadata = { title: 'Novo time' };

interface NewTeamRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default function NewTeamRoute({ params }: NewTeamRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário do time" />}>
      <NewTeamLoader params={params} />
    </Suspense>
  );
}
