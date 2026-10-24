import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { MatchListLoader } from '@/features/admin-matches/components/list/MatchListLoader';
import type { RawSearchParams } from '@/features/admin-matches/lib/match-list-query';

export const metadata: Metadata = { title: 'Partidas' };

interface AdminMatchesPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default function AdminMatchesPage({ searchParams }: AdminMatchesPageProps): ReactElement {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Carregando partidas…</p>}>
      <MatchListLoader searchParams={searchParams} />
    </Suspense>
  );
}
