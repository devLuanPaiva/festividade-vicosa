export enum MediaFolder {
  TEAM_PHOTO = 'TEAM_PHOTO',
  BEST_PLAYER = 'BEST_PLAYER',
  EVENT_PHOTO = 'EVENT_PHOTO',
  HISTORY_PHOTO = 'HISTORY_PHOTO',
  LIVE_PREVIEW = 'LIVE_PREVIEW',
}

export interface MediaTarget {
  folder: MediaFolder;
  segments: string[];
}

const SEGMENT_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const IMAGE_EXTENSION = '.webp';
const LEGACY_VARIANTS = ['thumb', 'medium', 'large'];

const ROOT_FOLDERS: Record<MediaFolder, string> = {
  [MediaFolder.TEAM_PHOTO]: 'teams',
  [MediaFolder.BEST_PLAYER]: 'matches',
  [MediaFolder.EVENT_PHOTO]: 'sub-events',
  [MediaFolder.HISTORY_PHOTO]: 'history',
  [MediaFolder.LIVE_PREVIEW]: 'live',
};

const SUBFOLDERS: Partial<Record<MediaFolder, string>> = {
  [MediaFolder.BEST_PLAYER]: 'best-player',
};

const STANDARD_NAMES: Record<MediaFolder, string> = {
  [MediaFolder.TEAM_PHOTO]: 'team',
  [MediaFolder.BEST_PLAYER]: 'best-player',
  [MediaFolder.EVENT_PHOTO]: 'photo',
  [MediaFolder.HISTORY_PHOTO]: 'photo',
  [MediaFolder.LIVE_PREVIEW]: 'preview',
};

const MANAGED_PREFIXES = ['teams/', 'matches/', 'sub-events/', 'history/', 'live/'];

export function buildMediaKey(target: MediaTarget, randomKey: string): string {
  const { folder, segments } = target;
  if (segments.length === 0 || !segments.every((segment) => SEGMENT_PATTERN.test(segment))) {
    throw new Error(
      'Each folder of a media file must be written in lowercase letters, digits and hyphens.',
    );
  }
  const subfolder = SUBFOLDERS[folder];
  const folders = [ROOT_FOLDERS[folder], ...segments, ...(subfolder ? [subfolder] : [])];
  return `${folders.join('/')}/${STANDARD_NAMES[folder]}-${randomKey}${IMAGE_EXTENSION}`;
}

export function objectKeysOf(storedKey: string): string[] {
  if (storedKey.endsWith(IMAGE_EXTENSION)) {
    return [storedKey];
  }
  return LEGACY_VARIANTS.map((variant) => `${storedKey}-${variant}${IMAGE_EXTENSION}`);
}

export function isManagedMediaKey(value: string): boolean {
  return MANAGED_PREFIXES.some((prefix) => value.startsWith(prefix)) && !value.includes('..');
}
