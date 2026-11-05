import { describe, expect, it } from 'vitest';
import publicManifest from '@/app/manifest';
import { buildPanelManifest } from './panel-manifest';

describe('panel manifest', () => {
  const panel = buildPanelManifest();

  it('opens the installed app straight on the panel', () => {
    expect(panel.start_url).toBe('/admin');
    expect(panel.scope).toBe('/admin');
  });

  it('is a different app from the public site, so both can be installed', () => {
    expect(panel.id).not.toBe(publicManifest().id);
    expect(publicManifest().start_url).toBe('/');
  });

  it('keeps the icons the install needs', () => {
    const sizes = (panel.icons ?? []).map((icon) => icon.sizes);

    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });
});
