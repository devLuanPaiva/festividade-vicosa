import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { CourtLocation } from '../enums/court-location.enum';
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

  @IsOptional()
  @IsEnum(CourtLocation, { message: VALIDATION_MESSAGES.courtLocation })
  public location?: CourtLocation | null;

  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public teamAId!: string;

  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public teamBId!: string;
}
