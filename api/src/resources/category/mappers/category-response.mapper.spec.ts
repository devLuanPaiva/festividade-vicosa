import type { Category } from '../entities/category.entity';
import { Gender } from '../enums/gender.enum';
import { toCategoryResponse } from './category-response.mapper';

describe('toCategoryResponse', () => {
  it('exposes the public fields of the category', () => {
    const category: Category = {
      id: 3,
      subEventId: 1,
      name: 'Sub-13',
      gender: Gender.MALE,
      ageRange: 'Sub-13',
    };

    expect(toCategoryResponse(category)).toEqual(category);
  });
});
