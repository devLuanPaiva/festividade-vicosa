import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import { resolveEffectivePermissions } from './resolve-effective-permissions';

const { MATCH_RECORD_SCORE, PHOTO_UPLOAD, PHOTO_DELETE } = Permission;
const { GRANTED, REVOKED } = PermissionEffect;

describe('resolveEffectivePermissions', () => {
  it.each([
    {
      scenario: 'returns the role permissions when there are no overrides',
      role: [MATCH_RECORD_SCORE, PHOTO_UPLOAD],
      overrides: [],
      expected: [MATCH_RECORD_SCORE, PHOTO_UPLOAD],
    },
    {
      scenario: 'adds a granted permission on top of the role',
      role: [MATCH_RECORD_SCORE],
      overrides: [{ permission: PHOTO_DELETE, effect: GRANTED }],
      expected: [MATCH_RECORD_SCORE, PHOTO_DELETE],
    },
    {
      scenario: 'removes a revoked permission from the role',
      role: [MATCH_RECORD_SCORE, PHOTO_UPLOAD],
      overrides: [{ permission: PHOTO_UPLOAD, effect: REVOKED }],
      expected: [MATCH_RECORD_SCORE],
    },
    {
      scenario: 'lets a revocation prevail over a grant of the same permission',
      role: [],
      overrides: [
        { permission: PHOTO_DELETE, effect: GRANTED },
        { permission: PHOTO_DELETE, effect: REVOKED },
      ],
      expected: [],
    },
    {
      scenario: 'does not duplicate a permission granted that the role already has',
      role: [PHOTO_UPLOAD],
      overrides: [{ permission: PHOTO_UPLOAD, effect: GRANTED }],
      expected: [PHOTO_UPLOAD],
    },
    {
      scenario: 'ignores a revocation of a permission the user never had',
      role: [PHOTO_UPLOAD],
      overrides: [{ permission: PHOTO_DELETE, effect: REVOKED }],
      expected: [PHOTO_UPLOAD],
    },
  ])('$scenario', ({ role, overrides, expected }) => {
    expect(resolveEffectivePermissions(role, overrides)).toEqual(expected);
  });
});
