import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
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
      <Suspense fallback={<AdminFormSkeleton label="Carregando a partida" count={4} />}>
        <ResultFormLoader params={params} />
      </Suspense>
    </>
  );
}
