import { ILike, type Repository } from 'typeorm';
import type { Category } from '../entities/category.entity';
import { Gender } from '../enums/gender.enum';
import { CategoryRepository } from './category.repository';

type TypeOrmMock = Record<'find' | 'findOneBy' | 'create' | 'save' | 'update', jest.Mock>;

function createFixture(): { repository: CategoryRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<Category>) => entity),
    save: jest.fn((entity: Partial<Category>) => Promise.resolve(entity)),
    update: jest.fn(),
  };
  return {
    repository: new CategoryRepository(typeorm as unknown as Repository<Category>),
    typeorm,
  };
}

describe('CategoryRepository', () => {
  it('lists the categories of a sub-event in creation order', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findBySubEvent('00000000-0000-4000-8000-000000000002', {});

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { subEventId: '00000000-0000-4000-8000-000000000002' },
      order: { id: 'ASC' },
    });
  });

  it('filters the categories by gender and name search', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findBySubEvent('00000000-0000-4000-8000-000000000002', {
      gender: Gender.FEMALE,
      search: 'sub',
    });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: {
        subEventId: '00000000-0000-4000-8000-000000000002',
        gender: Gender.FEMALE,
        name: ILike('%sub%'),
      },
      order: { id: 'ASC' },
    });
  });
});
