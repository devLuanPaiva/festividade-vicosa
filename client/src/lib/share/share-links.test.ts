import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppHref,
  photoSharePath,
  readSharedPhotoId,
  resolveShareUrl,
} from './share-links';

describe('resolveShareUrl', () => {
  const page = 'https://festividade.example/jogos/abc?foto=old#topo';

  it('turns a photo query into a link to the same page, dropping the previous query', () => {
    expect(resolveShareUrl('?foto=new', page)).toBe(
      'https://festividade.example/jogos/abc?foto=new',
    );
  });

  it('resolves a site path against the visitor origin', () => {
    expect(resolveShareUrl('/jogos/xyz', page)).toBe('https://festividade.example/jogos/xyz');
  });
});

describe('buildWhatsAppHref', () => {
  it('puts the message and the link in the text, encoded', () => {
    const href = buildWhatsAppHref('Final: A x B', 'https://site.example/jogos/1?foto=2');

    expect(href.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(href.split('text=')[1] ?? '')).toBe(
      'Final: A x B\nhttps://site.example/jogos/1?foto=2',
    );
  });
});

describe('photo links', () => {
  it('builds the query that opens a photo', () => {
    expect(photoSharePath('0b1c')).toBe('?foto=0b1c');
  });

  it.each([
    ['0b1c', '0b1c'],
    ['', null],
    [undefined, null],
    [['a', 'b'], null],
  ])('reads the shared photo id from %j', (value, expected) => {
    expect(readSharedPhotoId(value)).toBe(expected);
  });
});
