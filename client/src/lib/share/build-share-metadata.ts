import type { Metadata } from 'next';
import { SHARE_IMAGE, SITE_NAME } from '@/lib/seo/site-metadata';

export interface ShareMetadataInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export function buildShareMetadata({ title, description, imageUrl }: ShareMetadataInput): Metadata {
  const images = imageUrl ? [imageUrl] : [SHARE_IMAGE];
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
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
