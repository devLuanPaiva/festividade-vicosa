import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from '../dto/authenticated-user.dto';
import { AuthenticationService } from '../services/authentication.service';
import { extractBearerToken } from '../validators/bearer-token';
import { IS_PUBLIC_KEY } from '../decorators/decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = await this.authenticationService.authenticate(extractBearerToken(request));
    return Boolean(request.user);
  }

  private isPublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) === true
    );
  }
}
