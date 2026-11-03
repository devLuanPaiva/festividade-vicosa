import { ArrayMaxSize, IsArray, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export const MAX_QUALIFIED_TEAMS = 64;

export class ConfirmQualifiedDto {
  @IsArray({ message: VALIDATION_MESSAGES.qualifiedTeamIds })
  @ArrayMaxSize(MAX_QUALIFIED_TEAMS, { message: VALIDATION_MESSAGES.qualifiedTeamIds })
  @IsUUID('4', { each: true, message: VALIDATION_MESSAGES.qualifiedTeamIds })
  public teamIds!: string[];
}
