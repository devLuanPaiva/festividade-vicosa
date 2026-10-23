import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { OptionalLocation } from '../../../common/validation/field-decorators';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { MatchRound, MatchStage } from '../enums/match.enums';

export class CreateMatchDto {
  @IsEnum(MatchStage, { message: VALIDATION_MESSAGES.stage })
  public stage!: MatchStage;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.groupId })
  public groupId?: string;

  @IsOptional()
  @IsEnum(MatchRound, { message: VALIDATION_MESSAGES.round })
  public round?: MatchRound;

  @IsISO8601({ strict: true }, { message: VALIDATION_MESSAGES.dateTime })
  public scheduledAt!: string;

  @OptionalLocation()
  public location?: string;

  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public teamAId!: string;

  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public teamBId!: string;
}
