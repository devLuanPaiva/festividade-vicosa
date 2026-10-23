'use client';

import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { Parallax } from '@/components/motion/Parallax';
import { Sparkle } from '@/components/ui/Sparkle';
import type { Milestone } from '../../data/milestones.mock';

interface MilestoneEntryProps {
  milestone: Milestone;
  photoTone: string;
  onActivate: () => void;
}

export function MilestoneEntry({
  milestone,
  photoTone,
  onActivate,
}: MilestoneEntryProps): ReactElement {
  return (
    <motion.li
      onViewportEnter={onActivate}
      viewport={{ margin: '-45% 0px -45% 0px' }}
      className="relative"
    >
      <Sparkle className="absolute -left-[46px] top-2 size-6 text-sun drop-shadow md:-left-[62px]" />
      <p className="font-display text-6xl leading-none text-brand-500 lg:hidden">
        {milestone.year}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-brand-900 lg:mt-0">{milestone.title}</h3>
      <p className="mt-2 max-w-lg text-ink-soft">{milestone.description}</p>
      <figure className="mt-6 overflow-hidden rounded-3xl bg-brand-900 shadow-[0_12px_40px_rgba(7,59,134,0.2)]">
        <Parallax distance={30} className={`${photoTone} aspect-[16/9]`}>
          <span className="block h-[140%] w-full" />
        </Parallax>
        <figcaption className="flex items-center justify-between px-5 py-3 text-sm text-white/85">
          <span>
            {milestone.title}, {milestone.year}
          </span>
          <span className="rounded-full bg-sun px-3 py-1 text-xs font-semibold text-brand-900">
            Foto em breve
          </span>
        </figcaption>
      </figure>
    </motion.li>
  );
}
