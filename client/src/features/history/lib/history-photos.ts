import { getMediaPublicUrl } from '@/lib/config/server-env';
import { HISTORY_PHOTO_SIZES } from '../data/history-photo-sizes';
import type { HistoryPhoto } from '../types';

const HISTORY_FOLDER = 'history';
const ID_DIGITS = 3;

export function historyPhotoId(position: number): string {
  return `history-${String(position).padStart(ID_DIGITS, '0')}`;
}

export function listHistoryPhotos(): HistoryPhoto[] {
  const baseUrl = `${getMediaPublicUrl()}/${HISTORY_FOLDER}`;
  return HISTORY_PHOTO_SIZES.map(([width, height], index) => {
    const id = historyPhotoId(index + 1);
    return {
      id,
      url: `${baseUrl}/${id}.jpg`,
      width,
      height,
      alt: `Registro ${index + 1} dos 25 anos de história da JOCEV’S`,
    };
  });
}
