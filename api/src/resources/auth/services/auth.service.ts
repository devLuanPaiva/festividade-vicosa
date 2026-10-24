import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher } from '../../user/services/password-hasher';
import type { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import type { LoginDto } from '../dto/login.dto';
import { apiError } from '../../../common/errors/api-error';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UserService,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  public async login(credentials: LoginDto): Promise<AuthTokensDto> {
    const user = await this.findUserWithMatchingPassword(credentials);
    return this.tokenIssuer.startSession(user.id);
  }

  private async findUserWithMatchingPassword(credentials: LoginDto): Promise<User> {
    const user = await this.usersService.findActiveByEmail(credentials.email);
    const passwordMatches =
      user !== null && (await this.passwordHasher.verify(credentials.password, user.passwordHash));
    if (!user || !passwordMatches) {
      throw new UnauthorizedException(
        apiError('INVALID_CREDENTIALS', 'E-mail ou senha incorretos.'),
      );
    }
    return user;
  }
}
