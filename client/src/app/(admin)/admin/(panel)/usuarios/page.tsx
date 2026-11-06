import type { Metadata } from 'next';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { UserListLoader } from '@/features/admin-users/components/list/UserListLoader';
import type { RawSearchParams } from '@/features/admin-users/lib/user-list-query';

export const metadata: Metadata = { title: 'Usuários' };

interface UsersPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default function UsersPage({ searchParams }: Readonly<UsersPageProps>): ReactElement {
  return (
    <Suspense fallback={<AdminListSkeleton label="Carregando usuários" />}>
      <UserListLoader searchParams={searchParams} />
    </Suspense>
  );
}
