import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { categoryPath } from '../lib/admin-team-paths';

interface TeamPageHeaderProps {
  categoryId: string;
  categoryTitle: string;
  title: string;
}

export function TeamPageHeader({
  categoryId,
  categoryTitle,
  title,
}: TeamPageHeaderProps): ReactElement {
  return (
    <header className="flex flex-col gap-2">
      <nav aria-label="Você está em" className="text-sm text-admin-muted">
        <Link href={ADMIN_CATEGORIES_PATH} className="font-semibold text-brand-700">
          Categorias
        </Link>{' '}
        <span aria-hidden="true">›</span>{' '}
        <Link href={categoryPath(categoryId)} className="font-semibold text-brand-700">
          {categoryTitle}
        </Link>
      </nav>
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
