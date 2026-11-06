import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/config/server-env';

export const SITE_NAME = 'JOCEV’S';

export const SHARE_IMAGE = {
  url: '/logo-com-fundo.png',
  width: 1200,
  height: 630,
  alt: 'JOCEV’S 25 anos de emoções: Jornada Cultural e Esportiva de Viçosa',
};

const DEFAULT_TITLE = 'JOCEV’S 25 anos | Jornada Cultural e Esportiva de Viçosa';

const DESCRIPTION =
  'Jogos, placares, fotos, programação e a história da festividade de emancipação política de Viçosa/RN.';

const SHARE_DESCRIPTION =
  'Acompanhe os jogos, os placares, as fotos e a história da JOCEV’S, a jornada que virou tradição na festividade de dezembro em Viçosa/RN.';

const KEYWORDS = [
  'JOCEV’S',
  'JOCEVS',
  'Jornada Cultural e Esportiva de Viçosa',
  'festividade de Viçosa RN',
  'emancipação política de Viçosa',
  'campeonato de futsal',
  'campeonato de handebol',
  'jogos e placares ao vivo',
  'tabela de jogos',
  'classificação dos grupos',
  'galeria de fotos',
  'história da JOCEV’S',
  'programação da festividade',
  'Viçosa Rio Grande do Norte',
  'festa de dezembro',
];

const ICONS: Metadata['icons'] = {
  icon: '/favicon.ico',
  shortcut: '/favicon-32x32.png',
  apple: '/apple-touch-icon.png',
  other: [
    { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
    { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
    { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192' },
    { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512' },
  ],
};

const ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export function buildSiteMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: DESCRIPTION,
    keywords: KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: ROBOTS,
    icons: ICONS,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: '/',
      siteName: SITE_NAME,
      title: DEFAULT_TITLE,
      description: SHARE_DESCRIPTION,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_TITLE,
      description: SHARE_DESCRIPTION,
      images: [SHARE_IMAGE.url],
    },
    appleWebApp: { capable: true, title: 'JOCEV’S 2026', statusBarStyle: 'default' },
    category: 'sports',
  };
}
