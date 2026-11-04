import type { ReactElement } from 'react';
import { requireCurrentUser, requireSessionToken } from '@/lib/auth/current-user';
import { canViewChampionshipDashboard } from '../lib/dashboard-access';
import { getDashboardData } from '../services/get-dashboard-data';
import { DashboardView } from './DashboardView';
import { GalleryOnlyHome } from './GalleryOnlyHome';

export async function DashboardLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  const [firstName = user.name] = user.name.split(/\s+/);
  if (!canViewChampionshipDashboard(user.permissions)) {
    return <GalleryOnlyHome firstName={firstName} />;
  }
  const data = await getDashboardData(await requireSessionToken());
  return <DashboardView firstName={firstName} data={data} now={new Date()} />;
}
