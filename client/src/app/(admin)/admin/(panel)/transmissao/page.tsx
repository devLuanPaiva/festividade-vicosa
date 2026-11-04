import type { Metadata } from 'next';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { LiveListLoader } from '@/features/admin-live/components/LiveListLoader';

export const metadata: Metadata = { title: 'Transmissão ao vivo' };

export default function AdminLivePage(): ReactElement {
  return (
    <Suspense fallback={<AdminListSkeleton label="Carregando as transmissões" />}>
      <LiveListLoader />
    </Suspense>
  );
}
