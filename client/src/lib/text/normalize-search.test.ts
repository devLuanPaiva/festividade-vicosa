import { describe, expect, it } from 'vitest';
import { normalizeSearch } from './normalize-search';

describe('normalizeSearch', () => {
  it('ignores accents, case and the spaces around the text', () => {
    expect(normalizeSearch('  SÃO José ')).toBe('sao jose');
    expect(normalizeSearch('Portalegre Atlético')).toBe('portalegre atletico');
  });
});
