import {
  createParamDecorator,
  SetMetadata,
  UnauthorizedException,
  type CustomDecorator,
  type ExecutionContext,
} from '@nestjs/common';
import type { Permission } from '../../role/enums/permission.enum';
import type { AuthenticatedRequest, AuthenticatedUser } from '../dto/authenticated-user.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const REQUIRED_PERMISSIONS_KEY = 'requiredPermissions';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

export const RequirePermission = (...permissions: Permission[]): CustomDecorator =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  },
);
