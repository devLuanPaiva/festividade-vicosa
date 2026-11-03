import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class LoginDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.email })
  public email!: string;

  @IsString({ message: VALIDATION_MESSAGES.passwordRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.passwordRequired })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooLong })
  public password!: string;
}
