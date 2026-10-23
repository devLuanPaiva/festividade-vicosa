import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { apiError } from '../errors/api-error';
import { VALIDATION_MESSAGES } from '../validation/validation-messages';

export class ParseIdPipe extends ParseUUIDPipe {
  public constructor() {
    super({
      version: '4',
      exceptionFactory: (): BadRequestException =>
        new BadRequestException(apiError('INVALID_ID', VALIDATION_MESSAGES.id, 'id')),
    });
  }
}
