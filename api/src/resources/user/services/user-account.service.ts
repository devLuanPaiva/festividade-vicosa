import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { runUnlessReferenced } from '../../../common/database/foreign-key-violation';
import { apiError } from '../../../common/errors/api-error';
import { removeUser, deactivateUser } from '../../access/rules/access-changes';
import { AccessPolicyService } from '../../access/services/access-policy.service';
import type { UserWithRoles } from '../rules/user-roles';
import { UserService } from './user.service';

@Injectable()
export class UserAccountService {
  public constructor(
    private readonly userService: UserService,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  public activate(id: string): Promise<UserWithRoles> {
    return this.userService.setActive(id, true);
  }

  public async deactivate(id: string): Promise<UserWithRoles> {
    await this.userService.findByIdOrFail(id);
    await this.accessPolicy.assertPermissionsManagerRemains(deactivateUser(id));
    return this.userService.setActive(id, false);
  }

  public async remove(actorId: string, id: string): Promise<void> {
    this.assertNotDeletingSelf(actorId, id);
    await this.userService.findByIdOrFail(id);
    await this.accessPolicy.assertPermissionsManagerRemains(removeUser(id));
    await runUnlessReferenced(
      () => this.userService.remove(id),
      () =>
        new ConflictException(
          apiError(
            'USER_HAS_HISTORY',
            'Este usuário já lançou resultados ou enviou fotos. Desative-o em vez de excluir.',
          ),
        ),
    );
  }

  private assertNotDeletingSelf(actorId: string, id: string): void {
    if (actorId === id) {
      throw new ForbiddenException(
        apiError('CANNOT_DELETE_SELF', 'Você não pode excluir o seu próprio usuário.'),
      );
    }
  }
}
