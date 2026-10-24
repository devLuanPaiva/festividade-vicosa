import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { AdminMatchesLoader } from '@/features/admin-matches/components/AdminMatchesLoader';

export const metadata: Metadata = { title: 'Jogos' };

export default function AdminHomePage(): ReactElement {
  return (
    <>
      <h1 className="text-2xl font-bold">Lançar placar</h1>
      <Suspense fallback={<p className="text-sm text-admin-muted">Carregando jogos…</p>}>
        <AdminMatchesLoader />
      </Suspense>
    </>
  );
}
