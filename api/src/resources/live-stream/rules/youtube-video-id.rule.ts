const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const SHORT_LINK_HOST = 'youtu.be';
const WATCH_PATH = '/watch';
const WATCH_PARAMETER = 'v';
const WEB_PROTOCOLS = new Set(['https:', 'http:']);
const VIDEO_PATH_PREFIXES = new Set(['live', 'embed', 'shorts', 'v']);
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

function parseWebUrl(link: string): URL | null {
  try {
    const url = new URL(link);
    return WEB_PROTOCOLS.has(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function pathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

function youtubeCandidateOf(url: URL): string | null {
  if (url.pathname === WATCH_PATH) {
    return url.searchParams.get(WATCH_PARAMETER);
  }
  const [prefix = '', videoId = null] = pathSegments(url.pathname);
  return VIDEO_PATH_PREFIXES.has(prefix) ? videoId : null;
}

function candidateOf(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (host === SHORT_LINK_HOST) {
    return pathSegments(url.pathname)[0] ?? null;
  }
  return YOUTUBE_HOSTS.has(host) ? youtubeCandidateOf(url) : null;
}

export function extractYoutubeVideoId(link: string): string | null {
  const trimmed = link.trim();
  if (VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }
  const url = parseWebUrl(trimmed);
  const candidate = url ? candidateOf(url) : null;
  return candidate && VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
}
