import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_LOCATION_LENGTH,
  MAX_SCORE,
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

export function OptionalLocation(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    IsOptional(),
    IsString({ message: VALIDATION_MESSAGES.location }),
    MaxLength(MAX_LOCATION_LENGTH, { message: VALIDATION_MESSAGES.location }),
  );
}

export function BoundedInteger(message: string): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    Type(() => Number),
    IsInt({ message }),
    Min(0, { message }),
    Max(MAX_SCORE, { message }),
  );
}
