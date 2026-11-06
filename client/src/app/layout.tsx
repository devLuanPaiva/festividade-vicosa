import type { Metadata, Viewport } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { fontVariableClassNames } from '@/lib/fonts';
import { EARLY_CAPTURE_SCRIPT } from '@/lib/pwa/early-install-capture';
import { buildSiteMetadata } from '@/lib/seo/site-metadata';
import './globals.css';

export const metadata: Metadata = buildSiteMetadata();

export const viewport: Viewport = {
  themeColor: '#073b86',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>): ReactElement {
  return (
    <html lang="pt-BR" className={fontVariableClassNames}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY_CAPTURE_SCRIPT }} />
      </head>
      <body className="font-sans antialiased" cz-shortcut-listen="false">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
