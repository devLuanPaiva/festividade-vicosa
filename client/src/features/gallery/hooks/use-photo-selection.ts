import { useState } from 'react';
import { downloadSequentially } from '../lib/download-sequence';
import { downloadHref, photoFileName } from '../lib/photo-download';
import type { GalleryImage } from '../types';

interface PhotoSelection {
  isSelecting: boolean;
  isDownloading: boolean;
  selectedIds: Set<string>;
  start: () => void;
  cancel: () => void;
  toggle: (id: string) => void;
  selectAll: () => void;
  downloadSelected: () => void;
}

export function usePhotoSelection(images: GalleryImage[], fileBase: string): PhotoSelection {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const cancel = (): void => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  };
  const toggle = (id: string): void => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  };
  const downloadSelected = (): void => {
    const hrefs = images.flatMap((image, index) =>
      selectedIds.has(image.id)
        ? [downloadHref(image.storageKey, photoFileName(fileBase, index))]
        : [],
    );
    setIsDownloading(true);
    void downloadSequentially(hrefs).finally(() => setIsDownloading(false));
  };

  return {
    isSelecting,
    isDownloading,
    selectedIds,
    start: () => setIsSelecting(true),
    cancel,
    toggle,
    selectAll: () => setSelectedIds(new Set(images.map((image) => image.id))),
    downloadSelected,
  };
}
