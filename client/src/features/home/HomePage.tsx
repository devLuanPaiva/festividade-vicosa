import type { ReactElement, ReactNode } from 'react';
import { ClosingSection } from './components/closing/ClosingSection';
import { HeroSection } from './components/hero/HeroSection';
import { MarqueeBand } from './components/MarqueeBand';
import { ModalitiesSection } from './components/modalities/ModalitiesSection';
import { ProgramSection } from './components/program/ProgramSection';
import { StatsSection } from './components/stats/StatsSection';
import { TrajectorySection } from './components/trajectory/TrajectorySection';
import { marqueeBottomItems, marqueeTopItems } from './data/home-content';

export interface HomePageProps {
  modalitiesContent: ReactNode;
  programContent: ReactNode;
}

export function HomePage({ modalitiesContent, programContent }: HomePageProps): ReactElement {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TrajectorySection />
      <MarqueeBand items={marqueeTopItems} />
      <ModalitiesSection>{modalitiesContent}</ModalitiesSection>
      <ProgramSection>{programContent}</ProgramSection>
      <MarqueeBand items={marqueeBottomItems} reverse tilt="right" />
      <ClosingSection />
    </>
  );
}
