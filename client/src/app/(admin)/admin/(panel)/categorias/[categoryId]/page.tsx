import type { Metadata } from 'next';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
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
    <Suspense fallback={<AdminListSkeleton label="Carregando categoria" />}>
      <CategoryDetailLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
