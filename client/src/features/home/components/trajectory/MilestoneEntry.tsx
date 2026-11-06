'use client';

import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { Sparkle } from '@/components/ui/Sparkle';
import { PhotoCarousel } from '@/features/history/components/PhotoCarousel';
import { HISTORY_PATH } from '@/features/history/lib/history-paths';
import type { HistoryPhoto } from '@/features/history/types';
import type { Milestone } from '../../data/milestones.mock';

interface MilestoneEntryProps {
  milestone: Milestone;
  photos: HistoryPhoto[];
  onActivate: () => void;
}

export function MilestoneEntry({
  milestone,
  photos,
  onActivate,
}: Readonly<MilestoneEntryProps>): ReactElement {
  return (
    <motion.li
      onViewportEnter={onActivate}
      viewport={{ margin: '-45% 0px -45% 0px' }}
      className="relative"
    >
      <Sparkle className="absolute -left-[42px] top-2 size-6 text-sun drop-shadow md:-left-[58px]" />
      <p className="font-display text-6xl leading-none text-brand-500 lg:hidden">
        {milestone.year}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-brand-900 lg:mt-0">{milestone.title}</h3>
      <p className="mt-2 max-w-lg text-ink-soft">{milestone.description}</p>
      <Link
        href={HISTORY_PATH}
        aria-label={`Ver todas as fotos dos 25 anos de história, a partir de ${milestone.title}, ${milestone.year}`}
        className="group mt-6 block overflow-hidden rounded-3xl bg-brand-900 shadow-[0_12px_40px_rgba(7,59,134,0.2)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sun"
      >
        <PhotoCarousel photos={photos} />
        <div className="flex flex-col items-start gap-3 px-5 py-4 text-sm text-white/85 sm:flex-row sm:items-center sm:justify-between sm:py-3">
          <span>
            {milestone.title}, {milestone.year}
          </span>
          <span className="whitespace-nowrap rounded-full bg-sun px-4 py-1.5 text-xs font-semibold text-brand-900 transition-transform group-hover:translate-x-1">
            Ver galeria →
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
