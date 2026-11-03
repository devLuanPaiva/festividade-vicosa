import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export const MAX_ALBUM_PHOTOS = 500;

export class ReorderPhotosDto {
  @IsArray({ message: VALIDATION_MESSAGES.photoIds })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.photoIds })
  @ArrayMaxSize(MAX_ALBUM_PHOTOS, { message: VALIDATION_MESSAGES.photoIds })
  @IsUUID('4', { each: true, message: VALIDATION_MESSAGES.photoIds })
  public photoIds!: string[];
}
