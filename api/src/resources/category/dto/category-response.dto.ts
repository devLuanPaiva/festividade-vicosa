import type { Gender } from '../enums/gender.enum';

export interface CategoryResponseDto {
  id: string;
  subEventId: string;
  name: string;
  gender: Gender;
  ageRange: string | null;
}
