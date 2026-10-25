export const DOWNLOAD_PATH = '/galeria/download';

const STORED_KEY_PATTERN =
  /^(teams|matches|sub-events|history)\/[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*(\.webp)?$/;
const FILE_NAME_FALLBACK = 'foto';
const FILE_NAME_MAX_LENGTH = 80;
const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_FILE_NAME_CHARACTERS = /[^a-z0-9-]+/g;
const PAD_LENGTH = 2;

export interface DownloadRequest {
  key: string;
  fileName: string;
}

export function sanitizeFileName(name: string | null): string {
  const cleaned = (name ?? '')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(NON_FILE_NAME_CHARACTERS, '-')
    .split('-')
    .filter(Boolean)
    .join('-')
    .slice(0, FILE_NAME_MAX_LENGTH);
  return cleaned || FILE_NAME_FALLBACK;
}

export function photoFileName(base: string, index: number): string {
  return `${base}-${String(index + 1).padStart(PAD_LENGTH, '0')}`;
}

export function downloadHref(storedKey: string, fileName: string): string {
  return `${DOWNLOAD_PATH}?${new URLSearchParams({ key: storedKey, name: fileName }).toString()}`;
}

export function parseDownloadRequest(params: URLSearchParams): DownloadRequest | null {
  const key = params.get('key') ?? '';
  if (!STORED_KEY_PATTERN.test(key)) {
    return null;
  }
  return { key, fileName: sanitizeFileName(params.get('name')) };
}
