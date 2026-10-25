import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolvePhotoUrl } from './photo-url';

const DEMO_PHOTO_URL = 'https://api.dicebear.com/9.x/shapes/svg?seed=centro';
const TEAM_PHOTO_KEY = 'teams/0f6c/team-a1b2c3d4e5f6a7b8c9d0e1f2';

describe('resolvePhotoUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('has no photo when the key is empty', () => {
    expect(resolvePhotoUrl(null)).toBeNull();
  });

  it('keeps the demo photos that are stored as full urls', () => {
    expect(resolvePhotoUrl(DEMO_PHOTO_URL)).toBe(DEMO_PHOTO_URL);
  });

  it('points a stored key to the requested size on the cdn', () => {
    vi.stubEnv('MEDIA_PUBLIC_URL', 'https://cdn.example.com/');

    expect(resolvePhotoUrl(TEAM_PHOTO_KEY, 'thumb')).toBe(
      `https://cdn.example.com/${TEAM_PHOTO_KEY}-thumb.webp`,
    );
  });

  it('uses the medium size when none is asked for', () => {
    vi.stubEnv('MEDIA_PUBLIC_URL', 'https://cdn.example.com');

    expect(resolvePhotoUrl(TEAM_PHOTO_KEY)).toBe(
      `https://cdn.example.com/${TEAM_PHOTO_KEY}-medium.webp`,
    );
  });
});
