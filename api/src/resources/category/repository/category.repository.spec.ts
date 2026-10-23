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

  it('finds a category by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById('00000000-0000-4000-8000-000000000005');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: '00000000-0000-4000-8000-000000000005' });
  });

  it('finds a category by sub-event and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findBySubEventAndName('00000000-0000-4000-8000-000000000002', 'Adulto');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({
      subEventId: '00000000-0000-4000-8000-000000000002',
      name: 'Adulto',
    });
  });

  it('saves a new category', async () => {
    const { repository } = createFixture();
    const record = {
      subEventId: '00000000-0000-4000-8000-000000000002',
      name: 'Adulto',
      gender: Gender.MALE,
      ageRange: null,
    };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates a category by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update('00000000-0000-4000-8000-000000000005', { name: 'Principal' });

    expect(typeorm.update).toHaveBeenCalledWith(
      { id: '00000000-0000-4000-8000-000000000005' },
      { name: 'Principal' },
    );
  });
});
