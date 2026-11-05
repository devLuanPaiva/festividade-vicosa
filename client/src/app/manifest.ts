import type { MetadataRoute } from 'next';
import { MANIFEST_ICONS } from '@/lib/pwa/manifest-icons';

const BRAND_BLUE = '#073b86';
const SPLASH_BACKGROUND = '#ffffff';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'JOCEV’S 25 anos | Jornada Cultural e Esportiva de Viçosa',
    short_name: 'JOCEV’S 2026',
    description:
      'Jogos, placares, fotos, programação e a história da festividade de emancipação política de Viçosa/RN.',
    lang: 'pt-BR',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: SPLASH_BACKGROUND,
    theme_color: BRAND_BLUE,
    icons: MANIFEST_ICONS,
  };
}
