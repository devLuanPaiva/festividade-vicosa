import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  MAX_TOKEN_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class GoogleLoginDto {
  @IsString({ message: VALIDATION_MESSAGES.googleIdTokenRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.googleIdTokenRequired })
  @MaxLength(MAX_TOKEN_LENGTH, { message: VALIDATION_MESSAGES.googleIdTokenRequired })
  public idToken!: string;

  @IsString({ message: VALIDATION_MESSAGES.googleNonceRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.googleNonceRequired })
  @MaxLength(MAX_TOKEN_LENGTH, { message: VALIDATION_MESSAGES.googleNonceRequired })
  public nonce!: string;
}
