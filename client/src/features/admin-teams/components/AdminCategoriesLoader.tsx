import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { getAdminCategories } from '../services/get-admin-categories';
import { CategorySearchList } from './CategorySearchList';

export async function AdminCategoriesLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  return <CategorySearchList modalities={await getAdminCategories()} />;
}
