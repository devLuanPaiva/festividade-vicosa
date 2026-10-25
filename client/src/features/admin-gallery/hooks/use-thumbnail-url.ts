import { useEffect, useState } from 'react';
import { createThumbnail } from '@/lib/images/create-thumbnail';

const THUMBNAIL_WIDTH = 320;

export function useThumbnailUrl(file: File): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let createdUrl: string | null = null;
    let isCancelled = false;
    createThumbnail(file, THUMBNAIL_WIDTH)
      .then((blob) => {
        if (!isCancelled) {
          createdUrl = URL.createObjectURL(blob);
          setUrl(createdUrl);
        }
      })
      .catch(() => undefined);
    return () => {
      isCancelled = true;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [file]);

  return url;
}
