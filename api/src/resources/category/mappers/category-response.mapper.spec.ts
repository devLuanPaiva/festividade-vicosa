import type { Category } from '../entities/category.entity';
import { Gender } from '../enums/gender.enum';
import { toCategoryResponse } from './category-response.mapper';

describe('toCategoryResponse', () => {
  it('exposes the public fields of the category', () => {
    const category: Category = {
      id: '00000000-0000-4000-8000-000000000003',
      subEventId: '00000000-0000-4000-8000-000000000001',
      name: 'Sub-13',
      gender: Gender.MALE,
      ageRange: 'Sub-13',
    };

    expect(toCategoryResponse(category)).toEqual(category);
  });
});
