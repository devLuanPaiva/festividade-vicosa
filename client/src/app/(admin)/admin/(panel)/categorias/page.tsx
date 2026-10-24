import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { AdminCategoriesLoader } from '@/features/admin-teams/components/AdminCategoriesLoader';

export const metadata: Metadata = { title: 'Categorias' };

export default function AdminCategoriesPage(): ReactElement {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-sm text-admin-muted">
          Escolha uma categoria para gerir os grupos e os times dela.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-admin-muted">Carregando categorias…</p>}>
        <AdminCategoriesLoader />
      </Suspense>
    </>
  );
}
