import { describe, expect, it } from 'vitest';
import { groupByResource } from './permission-resources';

describe('groupByResource', () => {
  it('groups the permissions of the same entity, keeping the order of the catalog', () => {
    const sections = groupByResource([
      { code: 'match:create', description: 'Criar partidas' },
      { code: 'photo:upload', description: 'Enviar fotos' },
      { code: 'match:record-score', description: 'Lançar placares' },
    ]);

    expect(sections.map(({ label }) => label)).toEqual(['Partidas', 'Galeria']);
    expect(sections[0]?.permissions.map(({ code }) => code)).toEqual([
      'match:create',
      'match:record-score',
    ]);
  });

  it('still shows a permission of an entity that has no label yet', () => {
    const [section] = groupByResource([{ code: 'sponsor:manage', description: 'Patrocinadores' }]);

    expect(section?.label).toBe('sponsor');
  });
});
