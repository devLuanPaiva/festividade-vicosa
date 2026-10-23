import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessControlService } from '../../role/services/access-control.service';
import { UserService } from '../../user/services/user.service';
import type { AuthenticatedUser } from '../dto/authenticated-user.dto';

interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class AuthenticationService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly accessControlService: AccessControlService,
  ) {}

  public async authenticate(token: string): Promise<AuthenticatedUser> {
    const { sub } = await this.verifyToken(token);
    const user = await this.usersService.findActiveById(sub);

    if (!user) {
      throw new UnauthorizedException('User is inactive or no longer exists');
    }

    const permissions = await this.accessControlService.getEffectivePermissions(user);
    return { id: user.id, name: user.name, email: user.email, permissions };
  }

  private async verifyToken(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
