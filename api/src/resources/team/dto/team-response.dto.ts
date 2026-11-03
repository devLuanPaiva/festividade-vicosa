export interface TeamResponseDto {
  id: string;
  categoryId: string;
  groupId: string | null;
  name: string;
  slug: string;
  city: string;
  abbreviation: string | null;
  photoKey: string | null;
}
