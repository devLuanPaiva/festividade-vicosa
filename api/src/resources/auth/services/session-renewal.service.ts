import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { RefreshSessionService } from '../../session/services/refresh-session.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import type { RefreshTokenDto } from '../dto/refresh-token.dto';
import { apiError } from '../../../common/errors/api-error';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class SessionRenewalService {
  public constructor(
    private readonly usersService: UserService,
    private readonly tokenIssuer: TokenIssuerService,
    private readonly sessionService: RefreshSessionService,
  ) {}

  public async refresh({ refreshToken }: RefreshTokenDto): Promise<AuthTokensDto> {
    const rotated = await this.sessionService.rotate(refreshToken);
    const user = await this.usersService.findActiveById(rotated.userId);
    if (!user) {
      await this.sessionService.close(rotated.token.value);
      throw new UnauthorizedException(
        apiError('USER_INACTIVE', 'Este usuário está inativo ou não existe mais.'),
      );
    }
    return this.tokenIssuer.buildTokens(user.id, rotated.token);
  }

  public logout({ refreshToken }: RefreshTokenDto): Promise<void> {
    return this.sessionService.close(refreshToken);
  }
}
