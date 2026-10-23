import { ArrayMaxSize, ArrayMinSize, IsArray, IsISO8601, IsUUID } from 'class-validator';
import { OptionalLocation } from '../../../common/validation/field-decorators';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export const MIN_BRACKET_TEAMS = 2;
export const MAX_BRACKET_TEAMS = 16;

export class GenerateBracketDto {
  @IsArray({ message: VALIDATION_MESSAGES.bracketTeamIds })
  @ArrayMinSize(MIN_BRACKET_TEAMS, { message: VALIDATION_MESSAGES.bracketTeamIds })
  @ArrayMaxSize(MAX_BRACKET_TEAMS, { message: VALIDATION_MESSAGES.bracketTeamIds })
  @IsUUID('4', { each: true, message: VALIDATION_MESSAGES.bracketTeamIds })
  public teamIds!: string[];

  @IsISO8601({ strict: true }, { message: VALIDATION_MESSAGES.dateTime })
  public scheduledAt!: string;

  @OptionalLocation()
  public location?: string;
}
