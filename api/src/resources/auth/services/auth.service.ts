import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasher } from '../../user/services/password-hasher';
import type { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import type { AccessTokenDto } from '../dto/access-token.dto';
import type { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UserService,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  public async login(credentials: LoginDto): Promise<AccessTokenDto> {
    const user = await this.findUserWithMatchingPassword(credentials);
    return { accessToken: await this.jwtService.signAsync({ sub: user.id }) };
  }

  private async findUserWithMatchingPassword(credentials: LoginDto): Promise<User> {
    const user = await this.usersService.findActiveByEmail(credentials.email);
    const passwordMatches =
      user !== null && (await this.passwordHasher.verify(credentials.password, user.passwordHash));

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
