import { RoleCode } from '../../role/enums/role-code.enum';
import type { User } from '../entities/user.entity';
import { toUserResponse } from './user-response.mapper';

describe('toUserResponse', () => {
  it('exposes the public fields and the role code, never the password hash', () => {
    const createdAt = new Date('2026-10-22T12:00:00Z');
    const user = {
      id: 4,
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'secret-hash',
      active: true,
      roleId: 2,
      role: { id: 2, code: RoleCode.MANAGER, name: 'Manager' },
      createdAt,
    } as User;

    expect(toUserResponse(user)).toEqual({
      id: 4,
      name: 'Ana',
      email: 'ana@example.com',
      active: true,
      roleCode: RoleCode.MANAGER,
      createdAt,
    });
  });
});
