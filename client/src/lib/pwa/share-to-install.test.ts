import { afterEach, describe, expect, it, vi } from 'vitest';
import { openShareSheet } from './share-to-install';

const TARGET = { title: 'JOCEV’S', url: 'https://jocevs.com.br/' };

function stubShare(share: unknown): void {
  vi.stubGlobal('navigator', { share });
}

describe('openShareSheet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens the share sheet where the browser offers it', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubShare(share);

    expect(await openShareSheet(TARGET)).toBe(true);
    expect(share).toHaveBeenCalledWith(TARGET);
  });

  it('asks for the manual steps when the browser cannot share', async () => {
    stubShare(undefined);

    expect(await openShareSheet(TARGET)).toBe(false);
  });

  it('does not nag the user who closed the share sheet', async () => {
    stubShare(vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError')));

    expect(await openShareSheet(TARGET)).toBe(true);
  });

  it('asks for the manual steps when sharing fails for another reason', async () => {
    stubShare(vi.fn().mockRejectedValue(new DOMException('blocked', 'NotAllowedError')));

    expect(await openShareSheet(TARGET)).toBe(false);
  });
});
