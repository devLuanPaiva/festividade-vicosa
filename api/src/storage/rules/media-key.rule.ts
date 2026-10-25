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
  segments: string[];
}

const SEGMENT_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const IMAGE_EXTENSION = 'webp';

const ROOT_FOLDERS: Record<MediaFolder, string> = {
  [MediaFolder.TEAM_PHOTO]: 'teams',
  [MediaFolder.MATCH_PHOTO]: 'matches',
  [MediaFolder.BEST_PLAYER]: 'matches',
  [MediaFolder.EVENT_PHOTO]: 'sub-events',
  [MediaFolder.HISTORY_PHOTO]: 'history',
};

const SUBFOLDERS: Partial<Record<MediaFolder, string>> = {
  [MediaFolder.MATCH_PHOTO]: 'photos',
  [MediaFolder.BEST_PLAYER]: 'best-player',
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
  const { folder, segments } = target;
  if (segments.length === 0 || !segments.every((segment) => SEGMENT_PATTERN.test(segment))) {
    throw new Error(
      'Each folder of a media file must be written in lowercase letters, digits and hyphens.',
    );
  }
  const subfolder = SUBFOLDERS[folder];
  const folders = [ROOT_FOLDERS[folder], ...segments, ...(subfolder ? [subfolder] : [])];
  return `${folders.join('/')}/${STANDARD_NAMES[folder]}-${randomKey}`;
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
