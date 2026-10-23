'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import type { Milestone } from '../../data/milestones.mock';

interface StickyYearProps {
  milestone: Milestone | undefined;
}

export function StickyYear({ milestone }: StickyYearProps): ReactElement {
  return (
    <div aria-hidden="true" className="hidden lg:block">
      <div className="sticky top-32">
        <AnimatePresence mode="wait">
          <motion.p
            key={milestone?.year}
            initial={{ y: 60, opacity: 0, rotate: 3 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -60, opacity: 0, rotate: -3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-linear-to-b from-brand-500 to-cyan-brand bg-clip-text font-display text-[10rem] leading-none text-transparent"
          >
            {milestone?.year}
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 max-w-[18ch] font-display text-3xl text-brand-900">{milestone?.title}</p>
      </div>
    </div>
  );
}
