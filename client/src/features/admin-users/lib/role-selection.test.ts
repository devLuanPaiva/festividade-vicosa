import { describe, expect, it } from 'vitest';
import { choosePrimaryRole, toggleRole } from './role-selection';

describe('toggleRole', () => {
  it('makes the first group of the user the primary one', () => {
    expect(toggleRole({ roleIds: [], primaryRoleId: '' }, 'a')).toEqual({
      roleIds: ['a'],
      primaryRoleId: 'a',
    });
  });

  it('keeps the primary group when another one is added', () => {
    expect(toggleRole({ roleIds: ['a'], primaryRoleId: 'a' }, 'b')).toEqual({
      roleIds: ['a', 'b'],
      primaryRoleId: 'a',
    });
  });

  it('passes the primary mark on when the primary group is removed', () => {
    expect(toggleRole({ roleIds: ['a', 'b'], primaryRoleId: 'a' }, 'a')).toEqual({
      roleIds: ['b'],
      primaryRoleId: 'b',
    });
  });

  it('leaves no primary group when the last group is removed', () => {
    expect(toggleRole({ roleIds: ['a'], primaryRoleId: 'a' }, 'a')).toEqual({
      roleIds: [],
      primaryRoleId: '',
    });
  });
});

describe('choosePrimaryRole', () => {
  it('also adds the group when it was not selected yet', () => {
    expect(choosePrimaryRole({ roleIds: ['a'], primaryRoleId: 'a' }, 'b')).toEqual({
      roleIds: ['a', 'b'],
      primaryRoleId: 'b',
    });
  });
});
