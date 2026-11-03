import type { Metadata } from 'next';
import { Suspense, type ReactElement } from 'react';
import { DashboardLoader } from '@/features/admin-dashboard/components/DashboardLoader';
import { DashboardSkeleton } from '@/features/admin-dashboard/components/DashboardSkeleton';

export const metadata: Metadata = { title: 'Início' };

export default function AdminHomePage(): ReactElement {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLoader />
    </Suspense>
  );
}
