import Link from 'next/link';
import type { ReactElement } from 'react';
import { categoryPath } from '../lib/admin-team-paths';
import type { CategoryTab } from '../lib/category-tabs';

interface CategoryTabsProps {
  categoryId: string;
  active: CategoryTab;
  teamCount: number;
  groupCount: number;
  matchCount: number | null;
}

export function CategoryTabs({
  categoryId,
  active,
  teamCount,
  groupCount,
  matchCount,
}: CategoryTabsProps): ReactElement {
  const tabs: { tab: CategoryTab; label: string }[] = [
    { tab: 'times', label: `Times (${teamCount})` },
    { tab: 'grupos', label: `Grupos (${groupCount})` },
    { tab: 'classificados', label: 'Classificados' },
    ...(matchCount === null
      ? []
      : [{ tab: 'partidas' as const, label: `Partidas (${matchCount})` }]),
  ];
  return (
    <nav aria-label="Seções da categoria" className="flex gap-2 border-b border-admin-line">
      {tabs.map(({ tab, label }) => (
        <Link
          key={tab}
          href={`${categoryPath(categoryId)}?aba=${tab}`}
          replace
          aria-current={tab === active ? 'page' : undefined}
          className={`-mb-px inline-flex min-h-12 items-center border-b-2 px-4 text-sm font-semibold ${
            tab === active
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-admin-muted hover:text-admin-ink'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
