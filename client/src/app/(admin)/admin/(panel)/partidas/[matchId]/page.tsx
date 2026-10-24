import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type ReactElement } from 'react';
import { ResultFormLoader } from '@/features/admin-result/components/ResultFormLoader';

export const metadata: Metadata = { title: 'Lançar resultado' };

interface AdminMatchRouteProps {
  params: Promise<{ matchId: string }>;
}

export default function AdminMatchRoute({ params }: AdminMatchRouteProps): ReactElement {
  return (
    <>
      <Link href="/admin" className="inline-flex min-h-11 items-center text-sm font-semibold">
        ← Voltar aos jogos
      </Link>
      <Suspense fallback={<p className="text-sm text-admin-muted">Carregando partida…</p>}>
        <ResultFormLoader params={params} />
      </Suspense>
    </>
  );
}
