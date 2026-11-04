import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { NewLiveLoader } from '@/features/admin-live/components/NewLiveLoader';

export const metadata: Metadata = { title: 'Nova transmissão' };

export default function NewLiveRoute(): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário da transmissão" />}>
      <NewLiveLoader />
    </Suspense>
  );
}
