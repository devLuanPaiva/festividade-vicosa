import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { NewRoleLoader } from '@/features/admin-users/components/roles/NewRoleLoader';

export const metadata: Metadata = { title: 'Novo grupo' };

export default function NewRolePage(): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário" />}>
      <NewRoleLoader />
    </Suspense>
  );
}
