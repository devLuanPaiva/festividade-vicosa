export enum MediaFolder {
  TEAM_PHOTO = 'TEAM_PHOTO',
  MATCH_PHOTO = 'MATCH_PHOTO',
  BEST_PLAYER = 'BEST_PLAYER',
  EVENT_PHOTO = 'EVENT_PHOTO',
  HISTORY_PHOTO = 'HISTORY_PHOTO',
}

export const IMAGE_VARIANTS = ['thumb', 'medium', 'large'] as const;
export type ImageVariant = (typeof IMAGE_VARIANTS)[number];

export interface MediaTarget {
  folder: MediaFolder;
  ownerId: string;
  day?: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_EXTENSION = 'webp';

const FOLDER_PATHS: Record<MediaFolder, (ownerId: string, day: string) => string> = {
  [MediaFolder.TEAM_PHOTO]: (ownerId) => `teams/${ownerId}`,
  [MediaFolder.MATCH_PHOTO]: (ownerId) => `matches/${ownerId}/photos`,
  [MediaFolder.BEST_PLAYER]: (ownerId) => `matches/${ownerId}/best-player`,
  [MediaFolder.EVENT_PHOTO]: (ownerId, day) => `sub-events/${ownerId}/${day}`,
  [MediaFolder.HISTORY_PHOTO]: (ownerId) => `history/${ownerId}`,
};

const STANDARD_NAMES: Record<MediaFolder, string> = {
  [MediaFolder.TEAM_PHOTO]: 'team',
  [MediaFolder.MATCH_PHOTO]: 'photo',
  [MediaFolder.BEST_PLAYER]: 'best-player',
  [MediaFolder.EVENT_PHOTO]: 'photo',
  [MediaFolder.HISTORY_PHOTO]: 'photo',
};

const MANAGED_PREFIXES = ['teams/', 'matches/', 'sub-events/', 'history/'];

export function buildMediaBaseKey(target: MediaTarget, randomKey: string): string {
  if (!UUID_PATTERN.test(target.ownerId)) {
    throw new Error('The owner of a media file must be identified by a UUID.');
  }
  const day = target.day ?? '';
  if (target.folder === MediaFolder.EVENT_PHOTO && !DAY_PATTERN.test(day)) {
    throw new Error('A gallery photo needs the day it belongs to, as YYYY-MM-DD.');
  }
  const folderPath = FOLDER_PATHS[target.folder](target.ownerId, day);
  return `${folderPath}/${STANDARD_NAMES[target.folder]}-${randomKey}`;
}

export function variantKey(baseKey: string, variant: ImageVariant): string {
  return `${baseKey}-${variant}.${IMAGE_EXTENSION}`;
}

export function allVariantKeys(baseKey: string): string[] {
  return IMAGE_VARIANTS.map((variant) => variantKey(baseKey, variant));
}

export function isManagedMediaKey(value: string): boolean {
  return MANAGED_PREFIXES.some((prefix) => value.startsWith(prefix)) && !value.includes('..');
}
