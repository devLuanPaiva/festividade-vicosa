import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class CreateUserDto {
  @RequiredName()
  public name!: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.email })
  public email!: string;

  @IsString({ message: VALIDATION_MESSAGES.passwordRequired })
  @MinLength(MIN_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooShort })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooLong })
  public password!: string;

  @IsUUID('4', { message: VALIDATION_MESSAGES.roleId })
  public roleId!: string;
}
