import Link from 'next/link';
import type { ReactElement } from 'react';
import { categoryPath } from '@/features/admin-teams/lib/admin-team-paths';
import { categoryLabel } from '@/features/games/lib/match-labels';
import type { Gender } from '@/features/games/types';
import type { CategoryProgress } from '../types';

interface CategoryProgressListProps {
  categories: CategoryProgress[];
}

function CategoryRow({ category }: { category: CategoryProgress }): ReactElement {
  const label = categoryLabel({ name: category.name, gender: category.gender as Gender });
  return (
    <li>
      <Link
        href={categoryPath(category.categoryId)}
        className="flex min-h-14 flex-col justify-center gap-1.5 px-4 py-2 transition-colors hover:bg-admin-canvas"
      >
        <span className="flex items-baseline justify-between gap-3 text-sm">
          <span className="truncate font-semibold">{label}</span>
          <span className="shrink-0 tabular-nums text-admin-muted">
            {category.finalized}/{category.matches} · {category.completionRate}%
          </span>
        </span>
        <span
          role="meter"
          aria-label={`Partidas finalizadas em ${label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={category.completionRate}
          className="block h-2 overflow-hidden rounded-full bg-admin-line"
        >
          <span
            className="block h-full rounded-full bg-chart-1"
            style={{ width: `${category.completionRate}%` }}
          />
        </span>
      </Link>
    </li>
  );
}

function groupBySubEvent(categories: CategoryProgress[]): [string, CategoryProgress[]][] {
  const groups = new Map<string, CategoryProgress[]>();
  for (const category of categories) {
    groups.set(category.subEventName, [...(groups.get(category.subEventName) ?? []), category]);
  }
  return [...groups.entries()];
}

export function CategoryProgressList({ categories }: CategoryProgressListProps): ReactElement {
  return (
    <section
      aria-labelledby="category-progress-title"
      className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface"
    >
      <h2 id="category-progress-title" className="px-4 pt-4 text-lg font-bold">
        Andamento por categoria
      </h2>
      {groupBySubEvent(categories).map(([subEventName, items]) => (
        <div key={subEventName}>
          <h3 className="mt-3 border-y border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted">
            {subEventName}
          </h3>
          <ul className="divide-y divide-admin-line">
            {items.map((category) => (
              <CategoryRow key={category.categoryId} category={category} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
