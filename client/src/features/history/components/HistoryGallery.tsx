'use client';

import { MotionConfig } from 'motion/react';
import { useMemo, useState, type ReactElement } from 'react';
import { useContainerWidth } from '../hooks/use-container-width';
import { rowCountFor } from '../lib/row-layout';
import { splitIntoRows } from '../lib/split-into-rows';
import type { HistoryPhoto } from '../types';
import { HistoryLightbox } from './HistoryLightbox';
import { HistoryTile } from './HistoryTile';

interface HistoryGalleryProps {
  photos: HistoryPhoto[];
}

export function HistoryGallery({ photos }: HistoryGalleryProps): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [containerRef, width] = useContainerWidth();
  const rows = useMemo(() => splitIntoRows(photos, rowCountFor(photos, width)), [photos, width]);
  const positionOf = useMemo(
    () => new Map(photos.map((photo, index) => [photo.id, index])),
    [photos],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={containerRef} className="flex flex-col gap-2 sm:gap-3">
        {rows.map((row) => (
          <ul key={row[0]?.id} className="flex gap-2 sm:gap-3">
            {row.map((photo) => (
              <HistoryTile
                key={photo.id}
                photo={photo}
                position={(positionOf.get(photo.id) ?? 0) + 1}
                total={photos.length}
                onOpen={() => setOpenIndex(positionOf.get(photo.id) ?? null)}
              />
            ))}
          </ul>
        ))}
      </div>
      <HistoryLightbox photos={photos} openIndex={openIndex} onChange={setOpenIndex} />
    </MotionConfig>
  );
}
