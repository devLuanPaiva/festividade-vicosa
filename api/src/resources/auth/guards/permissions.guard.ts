import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Permission } from '../../role/enums/permission.enum';
import type { AuthenticatedRequest } from '../dto/authenticated-user.dto';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/decorators';
import { apiError } from '../../../common/errors/api-error';

@Injectable()
export class PermissionsGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const required = this.readRequiredPermissions(context);
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const hasAll = required.every((permission) => user?.permissions.includes(permission));

    if (!hasAll) {
      throw new ForbiddenException(
        apiError('MISSING_PERMISSION', 'Você não tem permissão para realizar esta ação.'),
      );
    }

    return true;
  }

  private readRequiredPermissions(context: ExecutionContext): Permission[] {
    return (
      this.reflector.getAllAndOverride<Permission[] | undefined>(REQUIRED_PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? []
    );
  }
}
