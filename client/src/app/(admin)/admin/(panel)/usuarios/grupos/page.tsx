import type { Metadata } from 'next';
import { AdminLinksSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { RoleListLoader } from '@/features/admin-users/components/roles/RoleListLoader';

export const metadata: Metadata = { title: 'Grupos' };

export default function RolesPage(): ReactElement {
  return (
    <Suspense fallback={<AdminLinksSkeleton label="Carregando grupos" />}>
      <RoleListLoader />
    </Suspense>
  );
}
