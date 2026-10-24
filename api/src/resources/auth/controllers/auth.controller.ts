import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { SessionRenewalService } from '../services/session-renewal.service';
import { GoogleLoginDto } from '../dto/google-login.dto';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import type { AuthenticatedUser } from '../dto/authenticated-user.dto';
import { CurrentUser, Public } from '../decorators/decorators';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

const LOGIN_ATTEMPTS_PER_MINUTE = 5;
const ONE_MINUTE_IN_MILLISECONDS = 60_000;

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly sessionRenewalService: SessionRenewalService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: LOGIN_ATTEMPTS_PER_MINUTE, ttl: ONE_MINUTE_IN_MILLISECONDS } })
  @Post('login')
  @HttpCode(200)
  public login(@Body() credentials: LoginDto): Promise<AuthTokensDto> {
    return this.authService.login(credentials);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: LOGIN_ATTEMPTS_PER_MINUTE, ttl: ONE_MINUTE_IN_MILLISECONDS } })
  @Post('google')
  @HttpCode(200)
  public loginWithGoogle(@Body() identity: GoogleLoginDto): Promise<AuthTokensDto> {
    return this.googleAuthService.login(identity);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  public refresh(@Body() session: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.sessionRenewalService.refresh(session);
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  public logout(@Body() session: RefreshTokenDto): Promise<void> {
    return this.sessionRenewalService.logout(session);
  }

  @Get('me')
  public currentUser(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
