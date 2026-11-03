import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { AccessPolicyService } from '../../access/services/access-policy.service';
import { UserAccountService } from './user-account.service';
import type { UserService } from './user.service';

const ACTOR_ID = '00000000-0000-4000-8000-000000000001';
const TARGET_ID = '00000000-0000-4000-8000-000000000005';

function createFixture(): {
  service: UserAccountService;
  userService: Record<'findByIdOrFail' | 'setActive' | 'remove', jest.Mock>;
  accessPolicy: Record<'assertPermissionsManagerRemains', jest.Mock>;
} {
  const userService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: TARGET_ID }),
    setActive: jest.fn().mockResolvedValue({ id: TARGET_ID }),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const accessPolicy = {
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const service = new UserAccountService(
    userService as unknown as UserService,
    accessPolicy as unknown as AccessPolicyService,
  );
  return { service, userService, accessPolicy };
}

function foreignKeyViolation(): QueryFailedError {
  return new QueryFailedError('DELETE', [], Object.assign(new Error('fk'), { code: '23503' }));
}

describe('UserAccountService.deactivate', () => {
  it('deactivates a user after checking that a permissions manager remains', async () => {
    const { service, userService, accessPolicy } = createFixture();

    await service.deactivate(TARGET_ID);

    expect(accessPolicy.assertPermissionsManagerRemains).toHaveBeenCalledTimes(1);
    expect(userService.setActive).toHaveBeenCalledWith(TARGET_ID, false);
  });

  it('does not deactivate the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.deactivate(TARGET_ID)).rejects.toBeInstanceOf(ConflictException);
    expect(userService.setActive).not.toHaveBeenCalled();
  });

  it('does not deactivate a user that does not exist', async () => {
    const { service, userService } = createFixture();
    userService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.deactivate(TARGET_ID)).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('UserAccountService.remove', () => {
  it('deletes another user', async () => {
    const { service, userService } = createFixture();

    await service.remove(ACTOR_ID, TARGET_ID);

    expect(userService.remove).toHaveBeenCalledWith(TARGET_ID);
  });

  it('forbids deleting the own user', async () => {
    const { service, userService } = createFixture();

    await expect(service.remove(ACTOR_ID, ACTOR_ID)).rejects.toBeInstanceOf(ForbiddenException);
    expect(userService.remove).not.toHaveBeenCalled();
  });

  it('does not delete the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.remove(ACTOR_ID, TARGET_ID)).rejects.toBeInstanceOf(ConflictException);
    expect(userService.remove).not.toHaveBeenCalled();
  });

  it('keeps the user that launched results or photos and says to deactivate instead', async () => {
    const { service, userService } = createFixture();
    userService.remove.mockRejectedValue(foreignKeyViolation());

    await expect(service.remove(ACTOR_ID, TARGET_ID)).rejects.toMatchObject({
      response: { code: 'USER_HAS_HISTORY' },
    });
  });
});
