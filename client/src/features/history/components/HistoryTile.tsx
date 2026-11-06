'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import type { ReactElement } from 'react';
import type { HistoryPhoto } from '../types';

const GROW_PER_RATIO = 100;
const TILE_IMAGE_SIZES = '(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw';
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

interface HistoryTileProps {
  photo: HistoryPhoto;
  position: number;
  total: number;
  onOpen: () => void;
}

export function HistoryTile({
  photo,
  position,
  total,
  onOpen,
}: Readonly<HistoryTileProps>): ReactElement {
  const ratio = photo.width / photo.height;

  return (
    <motion.li
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: REVEAL_EASE }}
      style={{ flexGrow: ratio * GROW_PER_RATIO, flexBasis: 0 }}
      className="relative"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir a foto ${position} de ${total}`}
        className="group absolute inset-0 block size-full cursor-zoom-in overflow-hidden rounded-xl bg-brand-900/10 shadow-[0_8px_24px_rgba(7,59,134,0.14)] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sun"
      >
        <motion.div layoutId={photo.id} className="absolute inset-0">
          <Image
            src={photo.url}
            alt=""
            fill
            sizes={TILE_IMAGE_SIZES}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-brand-900/0 transition-colors duration-300 group-hover:bg-brand-900/20"
        />
      </button>
      <div aria-hidden="true" style={{ paddingBottom: `${100 / ratio}%` }} />
    </motion.li>
  );
}
