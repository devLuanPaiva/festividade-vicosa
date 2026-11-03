import type { HistoryPhoto } from '../types';

const MOBILE_MAX_WIDTH = 640;
const TABLET_MAX_WIDTH = 1024;
const MOBILE_ROW_HEIGHT = 130;
const TABLET_ROW_HEIGHT = 190;
const DESKTOP_ROW_HEIGHT = 250;

export const DEFAULT_CONTAINER_WIDTH = 1200;

export function targetRowHeight(containerWidth: number): number {
  if (containerWidth < MOBILE_MAX_WIDTH) {
    return MOBILE_ROW_HEIGHT;
  }
  return containerWidth < TABLET_MAX_WIDTH ? TABLET_ROW_HEIGHT : DESKTOP_ROW_HEIGHT;
}

export function rowCountFor(photos: HistoryPhoto[], containerWidth: number): number {
  const widthAtTarget = photos.reduce(
    (total, photo) => total + (photo.width / photo.height) * targetRowHeight(containerWidth),
    0,
  );
  return Math.max(1, Math.round(widthAtTarget / containerWidth));
}
