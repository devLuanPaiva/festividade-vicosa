import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { HistoryGallery } from '@/features/history/components/HistoryGallery';
import { listHistoryPhotos } from '@/features/history/lib/history-photos';

export const metadata: Metadata = {
  title: '25 anos de história',
  description: 'Fotos que contam 25 anos da JOCEV’S, a jornada esportiva e cultural de Viçosa/RN.',
};

export default function HistoryRoute(): ReactElement {
  return (
    <>
      <PageHero
        eyebrow="JOCEV’S"
        title="25 anos de história"
        description="Registros de uma jornada que começou na quadra e hoje movimenta a cidade inteira."
      />
      <Section tone="paper" withWave labelledBy="page-title">
        <HistoryGallery photos={listHistoryPhotos()} />
      </Section>
    </>
  );
}
