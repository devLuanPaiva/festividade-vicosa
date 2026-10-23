import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { BoundedInteger } from '../../../common/validation/field-decorators';
import {
  MAX_NAME_LENGTH,
  MAX_PHOTO_KEY_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class RecordResultDto {
  @BoundedInteger(VALIDATION_MESSAGES.score)
  public scoreA!: number;

  @BoundedInteger(VALIDATION_MESSAGES.score)
  public scoreB!: number;

  @IsOptional()
  @BoundedInteger(VALIDATION_MESSAGES.penalties)
  public penaltiesA?: number | null;

  @IsOptional()
  @BoundedInteger(VALIDATION_MESSAGES.penalties)
  public penaltiesB?: number | null;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.bestPlayerName })
  @MaxLength(MAX_NAME_LENGTH, { message: VALIDATION_MESSAGES.bestPlayerName })
  public bestPlayerName?: string | null;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.photoKey })
  @MaxLength(MAX_PHOTO_KEY_LENGTH, { message: VALIDATION_MESSAGES.photoKey })
  public bestPlayerPhotoKey?: string | null;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public bestPlayerTeamId?: string | null;
}
