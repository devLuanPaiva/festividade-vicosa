import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  VALIDATION_MESSAGES,
} from './validation-messages';

export function RequiredName(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsString({ message: VALIDATION_MESSAGES.nameRequired }),
    IsNotEmpty({ message: VALIDATION_MESSAGES.nameRequired }),
    MaxLength(MAX_NAME_LENGTH, { message: VALIDATION_MESSAGES.nameTooLong }),
  );
}

export function OptionalDescription(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsOptional(),
    IsString({ message: VALIDATION_MESSAGES.description }),
    MaxLength(MAX_DESCRIPTION_LENGTH, { message: VALIDATION_MESSAGES.description }),
  );
}
