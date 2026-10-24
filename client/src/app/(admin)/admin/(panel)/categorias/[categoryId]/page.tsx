import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { CategoryDetailLoader } from '@/features/admin-teams/components/CategoryDetailLoader';

export const metadata: Metadata = { title: 'Categoria' };

interface AdminCategoryRouteProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ aba?: string | string[] }>;
}

export default function AdminCategoryRoute({
  params,
  searchParams,
}: AdminCategoryRouteProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando categoria…</p>}>
      <CategoryDetailLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
