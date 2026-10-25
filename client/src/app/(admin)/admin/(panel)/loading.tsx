import type { ReactElement } from 'react';
import { AdminListSkeleton } from '@/features/admin-shell/components/loading/AdminSkeletons';

export default function AdminPanelLoading(): ReactElement {
  return <AdminListSkeleton label="Carregando a página" />;
}
