import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

const MAX_PASSWORD_LENGTH = 128;

export class LoginDto {
  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_PASSWORD_LENGTH)
  public password!: string;
}
