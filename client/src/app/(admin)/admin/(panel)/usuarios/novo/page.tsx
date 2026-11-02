import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { NewUserLoader } from '@/features/admin-users/components/form/NewUserLoader';

export const metadata: Metadata = { title: 'Novo usuário' };

export default function NewUserPage(): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o formulário" />}>
      <NewUserLoader />
    </Suspense>
  );
}
