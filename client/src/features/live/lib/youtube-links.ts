const EMBED_BASE_URL = 'https://www.youtube-nocookie.com/embed';
const WATCH_BASE_URL = 'https://www.youtube.com/watch';

export function buildEmbedUrl(videoId: string): string {
  const parameters = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' });
  return `${EMBED_BASE_URL}/${encodeURIComponent(videoId)}?${parameters.toString()}`;
}

export function buildWatchUrl(videoId: string): string {
  return `${WATCH_BASE_URL}?${new URLSearchParams({ v: videoId }).toString()}`;
}
