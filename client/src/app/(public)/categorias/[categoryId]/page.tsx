import type { Metadata } from 'next';
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
    <Suspense fallback={<div className="surface-arena min-h-svh" />}>
      <CategoryLoader params={params} />
    </Suspense>
  );
}
