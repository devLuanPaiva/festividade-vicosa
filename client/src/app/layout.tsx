import type { Metadata, Viewport } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { getSiteUrl } from '@/lib/config/server-env';
import { fontVariableClassNames } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  openGraph: { siteName: 'Festividade de Viçosa', locale: 'pt_BR', type: 'website' },
  title: {
    default: 'Festividade de Viçosa 2026 | JOCEV’S 25 anos de emoções',
    template: '%s | Festividade de Viçosa',
  },
  description:
    'Jogos, placares, fotos, programação e a história da festividade de emancipação política de Viçosa/RN.',
};

export const viewport: Viewport = {
  themeColor: '#073b86',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="pt-BR" className={fontVariableClassNames}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
