import { Suspense, type ReactElement } from 'react';
import { SubEventList } from '@/features/home/components/program/SubEventList';
import { SubEventSkeleton } from '@/features/home/components/program/SubEventSkeleton';
import { HomePage } from '@/features/home/HomePage';

const FESTIVAL_YEAR = 2026;

export default function Page(): ReactElement {
  return (
    <HomePage
      programContent={
        <Suspense fallback={<SubEventSkeleton />}>
          <SubEventList year={FESTIVAL_YEAR} />
        </Suspense>
      }
    />
  );
}
