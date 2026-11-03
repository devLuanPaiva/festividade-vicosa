import type { Metadata } from 'next';
import { CardGridSkeleton } from '@/components/loading/CardGridSkeleton';
import { PublicPageSkeleton } from '@/components/loading/PublicPageSkeleton';
import { Suspense, type ReactElement } from 'react';
import { CategoryLoader } from '@/features/games/components/CategoryLoader';

export const metadata: Metadata = {
  title: 'Classificação e chaveamento',
  description: 'Tabela de cada grupo e chaveamento do mata-mata da categoria.',
};

interface CategoryRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default function CategoryRoute({ params }: CategoryRouteProps): ReactElement {
  return (
    <Suspense
      fallback={
        <PublicPageSkeleton label="Carregando a categoria">
          <CardGridSkeleton count={4} />
        </PublicPageSkeleton>
      }
    >
      <CategoryLoader params={params} />
    </Suspense>
  );
}
