import type { Gender } from '../enums/gender.enum';

export interface CategoryResponseDto {
  id: number;
  subEventId: number;
  name: string;
  gender: Gender;
  ageRange: string | null;
}
