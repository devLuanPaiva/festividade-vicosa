import type { Repository } from 'typeorm';
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

    await repository.findBySubEvent(2);

    expect(typeorm.find).toHaveBeenCalledWith({ where: { subEventId: 2 }, order: { id: 'ASC' } });
  });

  it('finds a category by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById(5);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 5 });
  });

  it('finds a category by sub-event and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findBySubEventAndName(2, 'Adulto');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ subEventId: 2, name: 'Adulto' });
  });

  it('saves a new category', async () => {
    const { repository } = createFixture();
    const record = { subEventId: 2, name: 'Adulto', gender: Gender.MALE, ageRange: null };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates a category by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update(5, { name: 'Principal' });

    expect(typeorm.update).toHaveBeenCalledWith({ id: 5 }, { name: 'Principal' });
  });
});
