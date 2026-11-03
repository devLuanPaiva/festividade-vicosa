import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { AccessSnapshotRepository } from '../repository/access-snapshot.repository';
import type { AccessChange } from '../rules/access-changes';
import { countPermissionsManagers } from '../rules/permissions-manager.rule';

const OWN_ACCESS_MESSAGE = 'Você não pode alterar as suas próprias permissões.';

@Injectable()
export class AccessPolicyService {
  public constructor(private readonly snapshotRepository: AccessSnapshotRepository) {}

  public assertNotSelf(actorId: string, targetId: string): void {
    if (actorId === targetId) {
      throw new ForbiddenException(apiError('CANNOT_CHANGE_OWN_ACCESS', OWN_ACCESS_MESSAGE));
    }
  }

  public async assertNotMemberOfRole(actorId: string, roleId: string): Promise<void> {
    const { users } = await this.snapshotRepository.load();
    const actor = users.find((user) => user.id === actorId);

    if (actor?.roleIds.includes(roleId)) {
      throw new ForbiddenException(apiError('CANNOT_CHANGE_OWN_ACCESS', OWN_ACCESS_MESSAGE));
    }
  }

  public async assertPermissionsManagerRemains(change: AccessChange): Promise<void> {
    const before = await this.snapshotRepository.load();
    const managersAfter = countPermissionsManagers(change(before));

    if (countPermissionsManagers(before) > 0 && managersAfter === 0) {
      throw new ConflictException(
        apiError(
          'LAST_PERMISSIONS_MANAGER',
          'É preciso manter ao menos um usuário ativo que gerencie permissões.',
        ),
      );
    }
  }
}
