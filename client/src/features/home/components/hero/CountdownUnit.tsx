'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';

interface CountdownUnitProps {
  value: string;
  label: string;
}

export function CountdownUnit({ value, label }: CountdownUnitProps): ReactElement {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-brand-900/70 px-2 py-3 ring-1 ring-white/30">
      <span className="relative flex h-14 w-full justify-center overflow-hidden md:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="font-display text-5xl leading-[3.5rem] tabular-nums md:text-6xl md:leading-[4rem]"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-1 text-xs font-medium text-white/80">{label}</span>
    </div>
  );
}
