import { describe, expect, it } from 'vitest';
import {
  downloadHref,
  parseDownloadRequest,
  photoFileName,
  sanitizeFileName,
} from './photo-download';

const KEY = 'sub-events/jocev-handball/2026-12-04/photo-a1b2c3d4e5f6a7b8c9d0e1f2.webp';

function parse(query: string): ReturnType<typeof parseDownloadRequest> {
  return parseDownloadRequest(new URLSearchParams(query));
}

describe('parseDownloadRequest', () => {
  it('accepts the key the API stored, with the name chosen for the file', () => {
    expect(parse(`key=${KEY}&name=festividade-2026-12-04-01`)).toEqual({
      key: KEY,
      fileName: 'festividade-2026-12-04-01',
    });
  });

  it('accepts a photo saved before the single file, without the extension', () => {
    const legacy = 'teams/0f6c/team-a1b2c3d4e5f6a7b8c9d0e1f2';

    expect(parse(`key=${legacy}`)?.key).toBe(legacy);
  });

  it.each([
    { name: 'a path that climbs out of the folders', key: 'sub-events/../secrets.webp' },
    { name: 'an address of another site', key: 'https://evil.example.com/photo.webp' },
    { name: 'a folder the API does not write to', key: 'users/avatar.webp' },
    { name: 'a key with a query string', key: `${KEY}?x=1` },
    { name: 'a key with uppercase letters', key: 'Teams/centro/team-ABC.webp' },
    { name: 'no key at all', key: '' },
  ])('refuses $name', ({ key }) => {
    expect(parse(new URLSearchParams({ key }).toString())).toBeNull();
  });
});

describe('sanitizeFileName', () => {
  it.each([
    { input: 'Festividade Viçosa 2026!', expected: 'festividade-vicosa-2026' },
    { input: '../../etc/passwd', expected: 'etc-passwd' },
    { input: '"; rm -rf', expected: 'rm-rf' },
    { input: '', expected: 'foto' },
    { input: null, expected: 'foto' },
  ])('writes "$input" as "$expected"', ({ input, expected }) => {
    expect(sanitizeFileName(input)).toBe(expected);
  });

  it('keeps a long name within a reasonable size', () => {
    expect(sanitizeFileName('a'.repeat(500))).toHaveLength(80);
  });
});

describe('photoFileName and downloadHref', () => {
  it('numbers the photos of an album from 01', () => {
    expect(photoFileName('festividade-2026-12-04', 0)).toBe('festividade-2026-12-04-01');
    expect(photoFileName('festividade-2026-12-04', 11)).toBe('festividade-2026-12-04-12');
  });

  it('builds a link that the download route reads back', () => {
    const href = downloadHref(KEY, 'foto-01');
    const query = new URL(href, 'https://site.example').searchParams;

    expect(href.startsWith('/galeria/download?')).toBe(true);
    expect(parseDownloadRequest(query)).toEqual({ key: KEY, fileName: 'foto-01' });
  });
});
