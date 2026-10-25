import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_CATEGORIES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { newTeamPath } from '../lib/admin-team-paths';

interface CategoryHeaderProps {
  categoryId: string;
  title: string;
  metadata: string;
}

export function CategoryHeader({ categoryId, title, metadata }: CategoryHeaderProps): ReactElement {
  return (
    <header className="flex flex-col gap-3">
      <nav aria-label="Você está em" className="text-sm text-admin-muted">
        <Link
          href={ADMIN_CATEGORIES_PATH}
          className="inline-flex min-h-11 items-center font-semibold text-brand-700"
        >
          Categorias
        </Link>{' '}
        <span aria-hidden="true">›</span> {title}
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-admin-muted">{metadata}</p>
        </div>
        <Link
          href={newTeamPath(categoryId)}
          className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
        >
          Adicionar time
        </Link>
      </div>
    </header>
  );
}
