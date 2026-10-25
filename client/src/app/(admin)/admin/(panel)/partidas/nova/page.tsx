import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { ChooseCategoryLoader } from '@/features/admin-matches/components/ChooseCategoryLoader';

export const metadata: Metadata = { title: 'Nova partida' };

export default function ChooseCategoryPage(): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando categorias…</p>}>
      <ChooseCategoryLoader />
    </Suspense>
  );
}
