import type { Metadata } from 'next';

const SITE_NAME = 'Festividade de Viçosa';

export interface ShareMetadataInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export function buildShareMetadata({ title, description, imageUrl }: ShareMetadataInput): Metadata {
  const images = imageUrl ? [imageUrl] : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      images,
    },
    twitter: { card: images ? 'summary_large_image' : 'summary', title, description, images },
  };
}
