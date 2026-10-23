import type { ReactElement, ReactNode } from 'react';
import { Container } from './Container';

export type SectionTone = 'sky' | 'deep' | 'paper';

interface SectionProps {
  tone: SectionTone;
  id?: string;
  children: ReactNode;
  labelledBy?: string;
}

export function Section({ tone, id, children, labelledBy }: SectionProps): ReactElement {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`surface-${tone} scroll-mt-16`}>
      <Container className="py-16 md:py-24">{children}</Container>
    </section>
  );
}
