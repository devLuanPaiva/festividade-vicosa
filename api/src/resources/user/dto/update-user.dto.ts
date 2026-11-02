import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class UpdateUserDto {
  @IsOptional()
  @RequiredName()
  public name?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.email })
  public email?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.passwordRequired })
  @MinLength(MIN_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooShort })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooLong })
  public password?: string;
}
