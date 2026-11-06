import { describe, expect, it } from 'vitest';
import { SHARE_IMAGE } from '@/lib/seo/site-metadata';
import { buildShareMetadata } from './build-share-metadata';

const PAGE = { title: 'Jogos', description: 'Placares e tabela.' };

describe('buildShareMetadata', () => {
  it('falls back to the default share image when the page has no photo', () => {
    const metadata = buildShareMetadata(PAGE);

    expect(metadata.openGraph?.images).toEqual([SHARE_IMAGE]);
    expect(metadata.twitter?.images).toEqual([SHARE_IMAGE]);
  });

  it('shares the page photo instead of the default image when there is one', () => {
    const metadata = buildShareMetadata({ ...PAGE, imageUrl: 'https://cdn.jocevs.com.br/a.jpg' });

    expect(metadata.openGraph?.images).toEqual(['https://cdn.jocevs.com.br/a.jpg']);
  });
});
