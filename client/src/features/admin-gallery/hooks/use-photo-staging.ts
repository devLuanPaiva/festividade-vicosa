import { useRef, useState } from 'react';
import { resizeForUpload } from '@/lib/images/resize-for-upload';
import { postAlbumPhoto } from '../lib/post-album-photo';
import { runWithConcurrency } from '../lib/run-with-concurrency';
import { selectPhotos } from '../lib/select-photos';
import { sendPhoto } from '../lib/send-photo';
import type { AlbumTarget, StagedPhoto } from '../types';

const PARALLEL_UPLOADS = 2;

export interface PhotoStaging {
  items: StagedPhoto[];
  notices: string[];
  isSending: boolean;
  sentCount: number | null;
  add: (files: File[]) => void;
  remove: (id: number) => void;
  clear: () => void;
  send: () => void;
}

export function usePhotoStaging(
  target: AlbumTarget,
  refresh: () => Promise<unknown>,
): PhotoStaging {
  const [items, setItems] = useState<StagedPhoto[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const nextId = useRef(0);

  const update = (id: number, changes: Partial<StagedPhoto>): void => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const add = (files: File[]): void => {
    const { accepted, notices: refused } = selectPhotos(files, items.length);
    const staged = accepted.map((file) => ({
      id: nextId.current++,
      file,
      status: 'staged' as const,
      message: null,
    }));
    setNotices(refused);
    setSentCount(null);
    setItems((current) => [...current, ...staged]);
  };

  const sendOne = async (item: StagedPhoto): Promise<boolean> => {
    update(item.id, { status: 'uploading', message: null });
    const failure = await sendPhoto(item.file, {
      resize: resizeForUpload,
      upload: (photo) => postAlbumPhoto(target, photo),
    });
    update(item.id, failure ? { status: 'failed', message: failure } : { status: 'done' });
    return failure === null;
  };

  const send = (): void => {
    const pending = items;
    let sent = 0;
    setIsSending(true);
    setNotices([]);
    setItems((current) => current.map((item) => ({ ...item, status: 'waiting', message: null })));
    void runWithConcurrency(pending, PARALLEL_UPLOADS, async (item) => {
      sent += (await sendOne(item)) ? 1 : 0;
    })
      .then(() => refresh())
      .finally(() => {
        setItems((current) => current.filter((item) => item.status !== 'done'));
        setSentCount(sent);
        setIsSending(false);
      });
  };

  return {
    items,
    notices,
    isSending,
    sentCount,
    add,
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clear: () => setItems([]),
    send,
  };
}
