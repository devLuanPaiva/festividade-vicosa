import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { categoryLabel, genderLabel } from '@/features/games/lib/match-labels';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { parseCategoryTab } from '../lib/category-tabs';
import { getCategoryRoster } from '../services/get-category-roster';
import { CategoryHeader } from './CategoryHeader';
import { CategoryTabs } from './CategoryTabs';
import { GroupsTab } from './GroupsTab';
import { TeamsTab } from './TeamsTab';

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
  const activeTab = parseCategoryTab((await searchParams).aba);
  const { category, subEvent, groups, teams } = await orNotFound(getCategoryRoster(categoryId));
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
      />
      {activeTab === 'grupos' ? (
        <GroupsTab categoryId={category.id} groups={groups} teams={teams} />
      ) : (
        <TeamsTab categoryId={category.id} groups={groups} teams={teams} />
      )}
    </>
  );
}
