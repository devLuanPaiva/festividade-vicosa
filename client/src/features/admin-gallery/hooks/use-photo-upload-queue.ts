import { useState } from 'react';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { resizeForUpload } from '@/lib/images/resize-for-upload';
import { processUploadQueue } from '../lib/process-upload-queue';
import type { UploadItem } from '../types';

type UploadAction = (formData: FormData) => Promise<FormErrorState>;

interface PhotoUploadQueue {
  items: UploadItem[];
  isRunning: boolean;
  start: (files: File[]) => void;
}

export function usePhotoUploadQueue(upload: UploadAction): PhotoUploadQueue {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const update = (id: number, changes: Pick<UploadItem, 'status' | 'message'>): void => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const start = (files: File[]): void => {
    const queued = files.map((file, index) => ({
      id: index,
      name: file.name,
      status: 'waiting' as const,
      message: null,
    }));
    setItems(queued);
    setIsRunning(true);
    void processUploadQueue(files, 0, {
      resize: resizeForUpload,
      upload,
      onChange: update,
    }).finally(() => setIsRunning(false));
  };

  return { items, isRunning, start };
}
