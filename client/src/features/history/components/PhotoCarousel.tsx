'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import type { HistoryPhoto } from '../types';

const SLIDE_INTERVAL_MS = 5000;
const FADE_SECONDS = 1.4;
const ZOOM_SECONDS = 7;
const SLIDE_ZOOM = 1.1;
const CARD_IMAGE_SIZES = '(min-width: 1024px) 560px, 90vw';

interface PhotoCarouselProps {
  photos: HistoryPhoto[];
}

function useSlideIndex(total: number, isPaused: boolean): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isPaused || total < 2) {
      return;
    }
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % total),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [isPaused, total]);

  return index;
}

export function PhotoCarousel({ photos }: PhotoCarouselProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const index = useSlideIndex(photos.length, shouldReduceMotion === true);
  const photo = photos[index];
  const upcoming = photos[(index + 1) % photos.length];

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-brand-900">
      {upcoming ? (
        <div aria-hidden="true" className="invisible absolute inset-0">
          <Image
            src={upcoming.url}
            alt=""
            fill
            loading="eager"
            sizes={CARD_IMAGE_SIZES}
            className="object-cover"
          />
        </div>
      ) : null}
      <AnimatePresence initial={false}>
        {photo ? (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: SLIDE_ZOOM }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              opacity: { duration: FADE_SECONDS, ease: 'easeInOut' },
              scale: { duration: ZOOM_SECONDS, ease: 'easeOut' },
            }}
            className="absolute inset-0"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes={CARD_IMAGE_SIZES}
              className="object-cover"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 to-transparent" />
    </div>
  );
}
