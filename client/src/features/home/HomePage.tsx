import type { ReactElement } from 'react';
import { PublicLayout } from '@/features/layout/PublicLayout';
import type { SubEvent } from '@/features/schedule/schedule-types';
import { HeroSection } from './components/HeroSection';
import { JocevSection } from './components/JocevSection';
import { ProgramSection } from './components/ProgramSection';
import { TrajectorySection } from './components/TrajectorySection';

export interface HomePageProps {
  subEvents: SubEvent[];
}

export function HomePage({ subEvents }: HomePageProps): ReactElement {
  return (
    <PublicLayout>
      <HeroSection />
      <TrajectorySection />
      <JocevSection />
      <ProgramSection subEvents={subEvents} />
    </PublicLayout>
  );
}
