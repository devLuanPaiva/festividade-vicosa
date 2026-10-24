import type { ReactElement } from 'react';
import { MatchesTab } from '@/features/admin-matches/components/MatchesTab';
import { buildCategoryMatchDays } from '@/features/admin-matches/lib/category-match-days';
import type { CategoryTab } from '../lib/category-tabs';
import type { CategoryDetail } from '../services/get-category-detail';
import { GroupsTab } from './GroupsTab';
import { TeamsTab } from './TeamsTab';

interface CategoryTabPanelProps {
  activeTab: CategoryTab;
  detail: CategoryDetail;
}

export function CategoryTabPanel({ activeTab, detail }: CategoryTabPanelProps): ReactElement {
  const { category, groups, teams, matches } = detail;
  if (activeTab === 'grupos') {
    return <GroupsTab categoryId={category.id} groups={groups} teams={teams} />;
  }
  if (activeTab === 'partidas') {
    const days = buildCategoryMatchDays(matches ?? [], teams, groups);
    return <MatchesTab categoryId={category.id} days={days} />;
  }
  return <TeamsTab categoryId={category.id} groups={groups} teams={teams} />;
}
