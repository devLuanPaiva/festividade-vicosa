import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Permission } from '../enums/permission.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import type { RoleRepository } from '../repository/role.repository';
import type { UserRoleRepository } from '../repository/user-role.repository';
import { RoleService } from './role.service';

const ADMIN_ID = '00000000-0000-4000-8000-000000000001';
const VOLUNTEER_ID = '00000000-0000-4000-8000-000000000002';

const adminRole = { id: ADMIN_ID, code: 'ADMIN', name: 'Administrador', system: true };
const volunteerRole = { id: VOLUNTEER_ID, code: 'voluntarios', name: 'Voluntários', system: false };

type RoleRepositoryMock = Record<
  'findAll' | 'findById' | 'findByNameOrCode' | 'create' | 'update' | 'remove',
  jest.Mock
>;

function createFixture(): { service: RoleService; roleRepository: RoleRepositoryMock } {
  const roleRepository: RoleRepositoryMock = {
    findAll: jest.fn().mockResolvedValue([adminRole, volunteerRole]),
    findById: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve([adminRole, volunteerRole].find((role) => role.id === id) ?? null),
      ),
    findByNameOrCode: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(volunteerRole),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const service = new RoleService(
    roleRepository as unknown as RoleRepository,
    {
      findAll: jest.fn().mockResolvedValue([
        { roleId: ADMIN_ID, permissionCode: Permission.USER_MANAGE },
        { roleId: ADMIN_ID, permissionCode: Permission.PHOTO_UPLOAD },
        { roleId: VOLUNTEER_ID, permissionCode: Permission.PHOTO_UPLOAD },
      ]),
    } as unknown as RolePermissionRepository,
    {
      countUsersByRole: jest.fn().mockResolvedValue(new Map([[ADMIN_ID, 2]])),
    } as unknown as UserRoleRepository,
  );
  return { service, roleRepository };
}

function foreignKeyViolation(): QueryFailedError {
  return new QueryFailedError('DELETE', [], Object.assign(new Error('fk'), { code: '23503' }));
}

describe('RoleService queries', () => {
  it('lists every role with its own permissions and its user count', async () => {
    const { service } = createFixture();

    await expect(service.list()).resolves.toEqual([
      {
        ...adminRole,
        permissions: [Permission.USER_MANAGE, Permission.PHOTO_UPLOAD],
        userCount: 2,
      },
      { ...volunteerRole, permissions: [Permission.PHOTO_UPLOAD], userCount: 0 },
    ]);
  });

  it('fails to get a role that does not exist', async () => {
    const { service } = createFixture();

    await expect(service.get('00000000-0000-4000-8000-000000000099')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('RoleService.create', () => {
  it('derives the code from the name', async () => {
    const { service, roleRepository } = createFixture();

    await service.create({ name: 'Voluntários da Festa', permissions: [Permission.PHOTO_UPLOAD] });

    expect(roleRepository.create).toHaveBeenCalledWith({
      name: 'Voluntários da Festa',
      code: 'voluntarios-da-festa',
      permissions: [Permission.PHOTO_UPLOAD],
    });
  });

  it('refuses a name that another group already uses', async () => {
    const { service, roleRepository } = createFixture();
    roleRepository.findByNameOrCode.mockResolvedValue([adminRole]);

    await expect(service.create({ name: 'administrador', permissions: [] })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(roleRepository.create).not.toHaveBeenCalled();
  });
});

describe('RoleService.rename', () => {
  it('keeps the code of a system group', async () => {
    const { service, roleRepository } = createFixture();

    await service.rename(ADMIN_ID, 'Super administrador');

    expect(roleRepository.update).toHaveBeenCalledWith(ADMIN_ID, {
      name: 'Super administrador',
      code: 'ADMIN',
    });
  });

  it('allows a group to keep its own name', async () => {
    const { service, roleRepository } = createFixture();
    roleRepository.findByNameOrCode.mockResolvedValue([volunteerRole]);

    await expect(service.rename(VOLUNTEER_ID, 'Voluntários')).resolves.toBeDefined();
  });
});

describe('RoleService.remove', () => {
  it('deletes a custom group', async () => {
    const { service, roleRepository } = createFixture();

    await service.remove(VOLUNTEER_ID);

    expect(roleRepository.remove).toHaveBeenCalledWith(VOLUNTEER_ID);
  });

  it('protects the system groups', async () => {
    const { service, roleRepository } = createFixture();

    await expect(service.remove(ADMIN_ID)).rejects.toBeInstanceOf(ConflictException);
    expect(roleRepository.remove).not.toHaveBeenCalled();
  });

  it('refuses to delete a group that still has users', async () => {
    const { service, roleRepository } = createFixture();
    roleRepository.remove.mockRejectedValue(foreignKeyViolation());

    await expect(service.remove(VOLUNTEER_ID)).rejects.toMatchObject({
      response: { code: 'ROLE_IN_USE' },
    });
  });
});
