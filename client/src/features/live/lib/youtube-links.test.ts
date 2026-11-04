import { describe, expect, it } from 'vitest';
import { buildEmbedUrl, buildWatchUrl } from './youtube-links';

describe('youtube links', () => {
  it('embeds through the privacy-friendly domain and starts playing on the first tap', () => {
    expect(buildEmbedUrl('dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&playsinline=1',
    );
  });

  it('never lets a odd video id change the address it points to', () => {
    expect(buildEmbedUrl('a/../b?c=d')).toBe(
      'https://www.youtube-nocookie.com/embed/a%2F..%2Fb%3Fc%3Dd?autoplay=1&rel=0&playsinline=1',
    );
  });

  it('builds the watch link used as a fallback', () => {
    expect(buildWatchUrl('dQw4w9WgXcQ')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });
});
