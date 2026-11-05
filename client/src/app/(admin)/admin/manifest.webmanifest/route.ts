import { buildPanelManifest } from '@/lib/pwa/panel-manifest';

const MANIFEST_CONTENT_TYPE = 'application/manifest+json';

export function GET(): Response {
  return Response.json(buildPanelManifest(), {
    headers: { 'Content-Type': MANIFEST_CONTENT_TYPE },
  });
}
