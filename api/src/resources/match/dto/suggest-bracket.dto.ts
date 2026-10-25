import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export const MIN_BRACKET_TEAMS = 2;
export const MAX_BRACKET_TEAMS = 32;

export class SuggestBracketDto {
  @IsArray({ message: VALIDATION_MESSAGES.bracketTeamIds })
  @ArrayMinSize(MIN_BRACKET_TEAMS, { message: VALIDATION_MESSAGES.bracketTeamIds })
  @ArrayMaxSize(MAX_BRACKET_TEAMS, { message: VALIDATION_MESSAGES.bracketTeamIds })
  @IsUUID('4', { each: true, message: VALIDATION_MESSAGES.bracketTeamIds })
  public teamIds!: string[];
}
