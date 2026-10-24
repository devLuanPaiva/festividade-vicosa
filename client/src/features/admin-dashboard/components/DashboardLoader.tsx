import type { ReactElement } from 'react';
import { requireCurrentUser, requireSessionToken } from '@/lib/auth/current-user';
import { getDashboardData } from '../services/get-dashboard-data';
import { DashboardView } from './DashboardView';

export async function DashboardLoader(): Promise<ReactElement> {
  const token = await requireSessionToken();
  const [user, data] = await Promise.all([requireCurrentUser(), getDashboardData(token)]);
  const [firstName = user.name] = user.name.split(/\s+/);
  return <DashboardView firstName={firstName} data={data} now={new Date()} />;
}
