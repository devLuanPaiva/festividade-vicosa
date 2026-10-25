'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import type { StagedPhoto } from '../types';
import { StagedPhotoCard } from './StagedPhotoCard';

interface StagedPhotoListProps {
  items: StagedPhoto[];
  isSending: boolean;
  onRemove: (id: number) => void;
}

export function StagedPhotoList({
  items,
  isSending,
  onRemove,
}: StagedPhotoListProps): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <StagedPhotoCard item={item} isSending={isSending} onRemove={() => onRemove(item.id)} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
