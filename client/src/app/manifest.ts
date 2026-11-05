import type { MetadataRoute } from 'next';

const BRAND_BLUE = '#073b86';
const SPLASH_BACKGROUND = '#ffffff';

export default function manifest(): MetadataRoute.Manifest {
  return {
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
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
