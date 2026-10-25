import type { Metadata } from 'next';
import { AdminLinksSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { ChooseCategoryLoader } from '@/features/admin-matches/components/ChooseCategoryLoader';

export const metadata: Metadata = { title: 'Nova partida' };

export default function ChooseCategoryPage(): ReactElement {
  return (
    <Suspense fallback={<AdminLinksSkeleton label="Carregando categorias" />}>
      <ChooseCategoryLoader />
    </Suspense>
  );
}
