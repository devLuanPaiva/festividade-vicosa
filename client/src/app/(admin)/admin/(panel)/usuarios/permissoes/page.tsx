import type { Metadata } from 'next';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';
import { Suspense, type ReactElement } from 'react';
import { PermissionCatalogLoader } from '@/features/admin-users/components/permissions/PermissionCatalogLoader';

export const metadata: Metadata = { title: 'Permissões' };

export default function PermissionsPage(): ReactElement {
  return (
    <Suspense fallback={<AdminListSkeleton label="Carregando permissões" />}>
      <PermissionCatalogLoader />
    </Suspense>
  );
}
