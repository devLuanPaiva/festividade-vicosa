import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { UserDetailLoader } from '@/features/admin-users/components/detail/UserDetailLoader';

export const metadata: Metadata = { title: 'Usuário' };

interface UserRouteProps {
  params: Promise<{ userId: string }>;
}

export default function UserPage({ params }: Readonly<UserRouteProps>): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o usuário" />}>
      <UserDetailLoader params={params} />
    </Suspense>
  );
}
