'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, type ReactElement } from 'react';
import { stepIndex } from '@/features/gallery/lib/step-index';
import type { HistoryPhoto } from '../types';
import { HistoryLightboxControls } from './HistoryLightboxControls';

const ARROW_OFFSETS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
interface HistoryLightboxProps {
  photos: HistoryPhoto[];
  openIndex: number | null;
  onChange: (index: number | null) => void;
}

function useLightboxKeyboard(
  isOpen: boolean,
  onClose: () => void,
  onStep: (offset: number) => void,
): void {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
      onStep(ARROW_OFFSETS[event.key] ?? 0);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onStep]);
}

export function HistoryLightbox({
  photos,
  openIndex,
  onChange,
}: Readonly<HistoryLightboxProps>): ReactElement {
  const photo = openIndex === null ? undefined : photos[openIndex];
  const close = (): void => onChange(null);
  const step = (offset: number): void => {
    if (openIndex !== null && offset !== 0) {
      onChange(stepIndex(openIndex, offset, photos.length));
    }
  };
  useLightboxKeyboard(photo !== undefined, close, step);

  return (
    <AnimatePresence>
      {photo ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de fotos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
        >
          <motion.div
            key={photo.id}
            layoutId={photo.id}
            onClick={(event) => event.stopPropagation()}
            className="relative size-full"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
          <HistoryLightboxControls
            position={(openIndex ?? 0) + 1}
            total={photos.length}
            onStep={step}
            onClose={close}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
