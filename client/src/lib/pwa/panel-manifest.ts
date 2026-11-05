import type { MetadataRoute } from 'next';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import { MANIFEST_ICONS } from './manifest-icons';

export const PANEL_MANIFEST_PATH = '/admin/manifest.webmanifest';

const BRAND_BLUE = '#073b86';
const SPLASH_BACKGROUND = '#ffffff';

export function buildPanelManifest(): MetadataRoute.Manifest {
  return {
    id: ADMIN_HOME_PATH,
    name: 'Painel JOCEV’S',
    short_name: 'Painel JOCEV’S',
    description: 'Painel da equipe para registrar placares, partidas, times e fotos da JOCEV’S.',
    lang: 'pt-BR',
    start_url: ADMIN_HOME_PATH,
    scope: ADMIN_HOME_PATH,
    display: 'standalone',
    orientation: 'portrait',
    background_color: SPLASH_BACKGROUND,
    theme_color: BRAND_BLUE,
    icons: MANIFEST_ICONS,
  };
}
