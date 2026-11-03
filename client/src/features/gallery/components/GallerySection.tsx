import type { ReactElement, ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { WaveEdge } from '@/components/ui/WaveEdge';

interface GallerySectionProps {
  label: string;
  children: ReactNode;
}

export function GallerySection({ label, children }: GallerySectionProps): ReactElement {
  return (
    <section aria-label={label} className="surface-paper">
      <WaveEdge />
      <Container className="flex flex-col gap-8 py-16 md:py-24">{children}</Container>
    </section>
  );
}
