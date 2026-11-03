'use client';

import { useState, type ReactElement } from 'react';
import { usePhotoSelection } from '../hooks/use-photo-selection';
import { findImageIndex } from '../lib/find-image';
import type { GalleryImage } from '../types';
import { GalleryThumb } from './GalleryThumb';
import { GalleryToolbar } from './GalleryToolbar';
import { PhotoLightbox } from './PhotoLightbox';

interface PhotoGalleryProps {
  images: GalleryImage[];
  fileBase: string;
  shareText: string;
  initialPhotoId?: string | null;
}

export function PhotoGallery({
  images,
  fileBase,
  shareText,
  initialPhotoId = null,
}: PhotoGalleryProps): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    findImageIndex(images, initialPhotoId),
  );
  const selection = usePhotoSelection(images, fileBase);

  return (
    <div className="flex flex-col gap-4">
      <GalleryToolbar
        isSelecting={selection.isSelecting}
        selectedCount={selection.selectedIds.size}
        totalCount={images.length}
        isDownloading={selection.isDownloading}
        onStartSelecting={selection.start}
        onCancel={selection.cancel}
        onSelectAll={selection.selectAll}
        onDownload={selection.downloadSelected}
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={image.id}>
            <GalleryThumb
              image={image}
              position={index + 1}
              total={images.length}
              isSelecting={selection.isSelecting}
              isSelected={selection.selectedIds.has(image.id)}
              onActivate={() =>
                selection.isSelecting ? selection.toggle(image.id) : setOpenIndex(index)
              }
            />
          </li>
        ))}
      </ul>
      <PhotoLightbox
        images={images}
        fileBase={fileBase}
        shareText={shareText}
        openIndex={openIndex}
        onChange={setOpenIndex}
      />
    </div>
  );
}
