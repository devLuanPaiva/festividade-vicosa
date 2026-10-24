import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel, genderLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { parseCategoryTab } from '../lib/category-tabs';
import { getCategoryDetail } from '../services/get-category-detail';
import { CategoryHeader } from './CategoryHeader';
import { CategoryTabPanel } from './CategoryTabPanel';
import { CategoryTabs } from './CategoryTabs';

interface CategoryDetailLoaderProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ aba?: string | string[] }>;
}

export async function CategoryDetailLoader({
  params,
  searchParams,
}: CategoryDetailLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'team:manage')) {
    return <NoPermission action="gerir categorias, grupos e times" />;
  }
  const { categoryId } = await params;
  const canManageMatches = hasPermission(user, 'match:create');
  const activeTab = parseCategoryTab((await searchParams).aba, canManageMatches);
  const detail = await orNotFound(getCategoryDetail(categoryId, canManageMatches));
  const { category, subEvent, groups, teams, matches } = detail;
  const metadata = [subEvent.name, genderLabel(category.gender), `${teams.length} times`]
    .filter(Boolean)
    .join(' · ');
  return (
    <>
      <CategoryHeader
        categoryId={category.id}
        title={categoryLabel(category)}
        metadata={metadata}
      />
      <CategoryTabs
        categoryId={category.id}
        active={activeTab}
        teamCount={teams.length}
        groupCount={groups.length}
        matchCount={matches ? matches.length : null}
      />
      <CategoryTabPanel activeTab={activeTab} detail={detail} />
    </>
  );
}
