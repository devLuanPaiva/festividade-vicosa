import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RoleCode } from '../../role/enums/role-code.enum';

const MAX_NAME_LENGTH = 120;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  public password!: string;

  @IsEnum(RoleCode)
  public roleCode!: RoleCode;
}
