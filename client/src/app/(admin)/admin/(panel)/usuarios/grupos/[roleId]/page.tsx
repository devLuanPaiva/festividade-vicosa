import type { Metadata } from 'next';
import { AdminFormSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { EditRoleLoader } from '@/features/admin-users/components/roles/EditRoleLoader';

export const metadata: Metadata = { title: 'Grupo' };

interface RoleRouteProps {
  params: Promise<{ roleId: string }>;
}

export default function RolePage({ params }: RoleRouteProps): ReactElement {
  return (
    <Suspense fallback={<AdminFormSkeleton label="Carregando o grupo" />}>
      <EditRoleLoader params={params} />
    </Suspense>
  );
}
