import type { CategoryResponseDto } from '../dto/category-response.dto';
import type { Category } from '../entities/category.entity';

export function toCategoryResponse(category: Category): CategoryResponseDto {
  return {
    id: category.id,
    subEventId: category.subEventId,
    name: category.name,
    gender: category.gender,
    ageRange: category.ageRange,
  };
}
