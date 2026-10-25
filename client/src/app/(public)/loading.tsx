import type { ReactElement } from 'react';
import { CardGridSkeleton } from '@/components/loading/CardGridSkeleton';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';

export default function PublicLoading(): ReactElement {
  return (
    <PublicPageSkeleton label="Carregando a página">
      <CardGridSkeleton />
    </PublicPageSkeleton>
  );
}
