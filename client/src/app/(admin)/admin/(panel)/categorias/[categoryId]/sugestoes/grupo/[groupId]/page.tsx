import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { GroupFixturesLoader } from '@/features/admin-suggestions/components/GroupFixturesLoader';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';

export const metadata: Metadata = { title: 'Sugestão de jogos do grupo' };

interface GroupFixturesRouteProps {
  params: Promise<{ categoryId: string; groupId: string }>;
}

export default function GroupFixturesRoute({ params }: GroupFixturesRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando a sugestão de jogos" count={5} />}>
      <GroupFixturesLoader params={params} />
    </Suspense>
  );
}
