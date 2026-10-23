import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { apiError } from '../errors/api-error';
import { VALIDATION_MESSAGES } from '../validation/validation-messages';

export class ParseIdPipe extends ParseIntPipe {
  public constructor() {
    super({
      exceptionFactory: (): BadRequestException =>
        new BadRequestException(apiError('INVALID_ID', VALIDATION_MESSAGES.id, 'id')),
    });
  }
}
