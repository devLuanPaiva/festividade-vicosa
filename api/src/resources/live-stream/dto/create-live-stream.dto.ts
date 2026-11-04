import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  MAX_LIVE_URL_LENGTH,
  MAX_NAME_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class CreateLiveStreamDto {
  @IsString({ message: VALIDATION_MESSAGES.liveTitle })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.liveTitle })
  @MaxLength(MAX_NAME_LENGTH, { message: VALIDATION_MESSAGES.liveTitle })
  public title!: string;

  @IsString({ message: VALIDATION_MESSAGES.liveUrl })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.liveUrl })
  @MaxLength(MAX_LIVE_URL_LENGTH, { message: VALIDATION_MESSAGES.liveUrl })
  public url!: string;

  @IsISO8601({ strict: true }, { message: VALIDATION_MESSAGES.dateTime })
  public startsAt!: string;
}
