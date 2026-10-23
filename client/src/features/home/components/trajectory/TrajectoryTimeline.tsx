'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useRef, useState, type ReactElement } from 'react';
import type { Milestone } from '../../data/milestones.mock';
import { MilestoneEntry } from './MilestoneEntry';
import { StickyYear } from './StickyYear';

const PHOTO_TONES = ['surface-sky', 'surface-arena', 'surface-splash'];

interface TrajectoryTimelineProps {
  milestones: Milestone[];
}

export function TrajectoryTimeline({ milestones }: TrajectoryTimelineProps): ReactElement {
  const listRef = useRef<HTMLOListElement>(null);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | undefined>(milestones[0]);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });

  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
      <StickyYear milestone={activeMilestone} />
      <div className="relative pl-8 md:pl-12">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-brand-500/15"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: progress }}
          className="absolute bottom-0 left-0 top-0 w-1 origin-top rounded-full bg-brand-500"
        />
        <ol ref={listRef} className="space-y-20">
          {milestones.map((milestone, index) => (
            <MilestoneEntry
              key={milestone.year}
              milestone={milestone}
              photoTone={PHOTO_TONES[index % PHOTO_TONES.length] ?? 'surface-sky'}
              onActivate={() => setActiveMilestone(milestone)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
