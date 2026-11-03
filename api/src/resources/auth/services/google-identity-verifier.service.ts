import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { apiError } from '../../../common/errors/api-error';
import type { EnvironmentVariables } from '../../../config/environment';
import {
  isGoogleIdentityProblem,
  resolveGoogleIdentity,
  type GoogleIdentity,
} from '../rules/google-identity.rule';

@Injectable()
export class GoogleIdentityVerifier {
  private readonly client = new OAuth2Client();

  public constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  public async verify(idToken: string, nonce: string): Promise<GoogleIdentity> {
    const claims = await this.readClaims(idToken, this.requireClientId());
    const identity = resolveGoogleIdentity(claims, nonce);
    if (isGoogleIdentityProblem(identity)) {
      throw new UnauthorizedException(apiError(identity.code, identity.detail));
    }
    return identity;
  }

  private requireClientId(): string {
    const clientId = this.config.get('GOOGLE_CLIENT_ID', { infer: true });
    if (!clientId) {
      throw new ServiceUnavailableException(
        apiError('GOOGLE_LOGIN_UNAVAILABLE', 'O login com Google não está disponível no momento.'),
      );
    }
    return clientId;
  }

  private async readClaims(idToken: string, clientId: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: clientId });
      const claims = ticket.getPayload();
      if (!claims) {
        throw new Error('Google token without payload');
      }
      return claims;
    } catch {
      throw new UnauthorizedException(
        apiError('GOOGLE_TOKEN_INVALID', 'Não foi possível confirmar o login com Google.'),
      );
    }
  }
}
