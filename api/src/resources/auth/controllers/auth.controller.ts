import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import type { AccessTokenDto } from '../dto/access-token.dto';
import type { AuthenticatedUser } from '../dto/authenticated-user.dto';
import { CurrentUser, Public } from '../decorators/decorators';
import { LoginDto } from '../dto/login.dto';

const LOGIN_ATTEMPTS_PER_MINUTE = 5;
const ONE_MINUTE_IN_MILLISECONDS = 60_000;

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: LOGIN_ATTEMPTS_PER_MINUTE, ttl: ONE_MINUTE_IN_MILLISECONDS } })
  @Post('login')
  @HttpCode(200)
  public login(@Body() credentials: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(credentials);
  }

  @Get('me')
  public currentUser(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
