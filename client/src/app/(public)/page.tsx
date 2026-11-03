import { Suspense, type ReactElement } from 'react';
import { ModalityGrid } from '@/features/home/components/modalities/ModalityGrid';
import { ModalityList } from '@/features/home/components/modalities/ModalityList';
import { SubEventList } from '@/features/home/components/program/SubEventList';
import { SubEventSkeleton } from '@/features/home/components/program/SubEventSkeleton';
import { HomePage } from '@/features/home/HomePage';
import { FESTIVAL_YEAR } from '@/lib/config/festival';

export default function Page(): ReactElement {
  return (
    <HomePage
      modalitiesContent={
        <Suspense fallback={<ModalityGrid subEvents={[]} />}>
          <ModalityList />
        </Suspense>
      }
      programContent={
        <Suspense fallback={<SubEventSkeleton />}>
          <SubEventList year={FESTIVAL_YEAR} />
        </Suspense>
      }
    />
  );
}
