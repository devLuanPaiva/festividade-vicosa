import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { resolveLoginTracker } from '../rules/login-tracker.rule';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected override async getTracker(req: Record<string, unknown>): Promise<string> {
    return resolveLoginTracker(req.body, await super.getTracker(req));
  }
}
