import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { OperationSuccessLoader } from '@/features/admin-shell/components/OperationSuccessLoader';
import type { RawSuccessParams } from '@/features/admin-shell/lib/operation-success';

export const metadata: Metadata = { title: 'Operação concluída' };

interface OperationSuccessPageProps {
  searchParams: Promise<RawSuccessParams>;
}

export default function OperationSuccessPage({
  searchParams,
}: Readonly<OperationSuccessPageProps>): ReactElement {
  return (
    <Suspense fallback={null}>
      <OperationSuccessLoader searchParams={searchParams} />
    </Suspense>
  );
}
