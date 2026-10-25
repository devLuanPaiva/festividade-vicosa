import type { NextRequest } from 'next/server';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import { parseDownloadRequest } from '@/features/gallery/lib/photo-download';

const NOT_FOUND_STATUS = 404;
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

function notFound(): Response {
  return new Response('Foto não encontrada.', { status: NOT_FOUND_STATUS });
}

async function fetchOriginal(storedKey: string): Promise<Response | null> {
  const sourceUrl = resolvePhotoUrl(storedKey, 'large');
  const upstream = sourceUrl ? await fetch(sourceUrl).catch(() => null) : null;
  return upstream?.ok && upstream.body ? upstream : null;
}

export async function GET(request: NextRequest): Promise<Response> {
  const download = parseDownloadRequest(request.nextUrl.searchParams);
  const original = download ? await fetchOriginal(download.key) : null;
  if (!download || !original) {
    return notFound();
  }
  return new Response(original.body, {
    headers: {
      'Content-Type': 'image/webp',
      'Content-Disposition': `attachment; filename="${download.fileName}.webp"`,
      'Cache-Control': IMMUTABLE_CACHE_CONTROL,
    },
  });
}
