import type { Edition } from '../entities/edition.entity';
import { toEditionResponse } from './edition-response.mapper';

describe('toEditionResponse', () => {
  it('exposes the public fields of the edition', () => {
    const edition = { id: 1, year: 2026, name: 'Festividade 2026', description: null } as Edition;

    expect(toEditionResponse(edition)).toEqual({
      id: 1,
      year: 2026,
      name: 'Festividade 2026',
      description: null,
    });
  });
});
