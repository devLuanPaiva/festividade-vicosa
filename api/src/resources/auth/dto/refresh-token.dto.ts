import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  MAX_TOKEN_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class RefreshTokenDto {
  @IsString({ message: VALIDATION_MESSAGES.refreshTokenRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.refreshTokenRequired })
  @MaxLength(MAX_TOKEN_LENGTH, { message: VALIDATION_MESSAGES.refreshTokenRequired })
  public refreshToken!: string;
}
