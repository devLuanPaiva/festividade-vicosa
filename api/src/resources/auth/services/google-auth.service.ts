import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import type { GoogleLoginDto } from '../dto/google-login.dto';
import { apiError } from '../../../common/errors/api-error';
import { GoogleIdentityVerifier } from './google-identity-verifier.service';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class GoogleAuthService {
  public constructor(
    private readonly verifier: GoogleIdentityVerifier,
    private readonly usersService: UserService,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  public async login({ idToken, nonce }: GoogleLoginDto): Promise<AuthTokensDto> {
    const identity = await this.verifier.verify(idToken, nonce);
    const user = await this.usersService.findActiveByEmail(identity.email);
    if (!user) {
      throw new ForbiddenException(
        apiError(
          'GOOGLE_EMAIL_NOT_AUTHORIZED',
          'Este e-mail não tem acesso ao painel. Fale com o administrador.',
        ),
      );
    }
    return this.tokenIssuer.startSession(user.id);
  }
}
