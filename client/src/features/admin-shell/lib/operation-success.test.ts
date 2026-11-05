import { describe, expect, it } from 'vitest';
import { resolveOperationSuccess, successPath } from './operation-success';

describe('resolveOperationSuccess', () => {
  it('returns the message and the screen the user came from', () => {
    const result = resolveOperationSuccess({
      operacao: 'team-created',
      voltar: '/admin/categorias/abc',
    });

    expect(result).toMatchObject({ title: 'Time criado', backPath: '/admin/categorias/abc' });
  });

  it.each([
    ['unknown operation', { operacao: 'drop-database', voltar: '/admin/usuarios' }],
    ['inherited property name', { operacao: 'constructor', voltar: '/admin/usuarios' }],
    ['missing operation', { voltar: '/admin/usuarios' }],
  ])('shows nothing for %s', (_case, params) => {
    expect(resolveOperationSuccess(params)).toBeNull();
  });

  it.each([
    ['external site', 'https://evil.example/admin/'],
    ['protocol-relative url', '//evil.example'],
    ['path outside the panel', '/jogos'],
    ['backslash trick', '/admin/\\evil.example'],
    ['missing value', undefined],
  ])('falls back to the panel home for %s', (_case, voltar) => {
    const result = resolveOperationSuccess({ operacao: 'user-deleted', voltar });

    expect(result?.backPath).toBe('/admin');
  });
});

describe('successPath', () => {
  it('round-trips through resolveOperationSuccess', () => {
    const url = new URL(
      successPath('match-updated', '/admin/categorias/a?aba=jogos'),
      'https://painel.test',
    );
    const params = Object.fromEntries(url.searchParams);

    expect(resolveOperationSuccess(params)?.backPath).toBe('/admin/categorias/a?aba=jogos');
  });
});
