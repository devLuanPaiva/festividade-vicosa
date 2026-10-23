import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';
import { RoleCode } from '../../role/enums/role-code.enum';

export class CreateUserDto {
  @IsString({ message: VALIDATION_MESSAGES.nameRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.nameRequired })
  @MaxLength(MAX_NAME_LENGTH, { message: VALIDATION_MESSAGES.nameTooLong })
  public name!: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.email })
  public email!: string;

  @IsString({ message: VALIDATION_MESSAGES.passwordRequired })
  @MinLength(MIN_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooShort })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: VALIDATION_MESSAGES.passwordTooLong })
  public password!: string;

  @IsEnum(RoleCode, { message: VALIDATION_MESSAGES.roleCode })
  public roleCode!: RoleCode;
}
