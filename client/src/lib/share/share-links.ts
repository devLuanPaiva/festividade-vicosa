const WHATSAPP_SEND_URL = 'https://wa.me/';
const PHOTO_QUERY_KEY = 'foto';

export function resolveShareUrl(url: string, pageHref: string): string {
  return new URL(url, pageHref).toString();
}

export function buildWhatsAppHref(text: string, url: string): string {
  const message = `${text}\n${url}`;
  return `${WHATSAPP_SEND_URL}?text=${encodeURIComponent(message)}`;
}

export function photoSharePath(photoId: string): string {
  return `?${new URLSearchParams({ [PHOTO_QUERY_KEY]: photoId }).toString()}`;
}

export function readSharedPhotoId(value: string | string[] | undefined): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}
