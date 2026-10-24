import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel da Festividade' },
  robots: { index: false, follow: false },
};

interface AdminGroupLayoutProps {
  children: ReactNode;
}

export default function AdminGroupLayout({ children }: AdminGroupLayoutProps): ReactElement {
  return <div className="min-h-dvh bg-admin-canvas text-admin-ink">{children}</div>;
}
