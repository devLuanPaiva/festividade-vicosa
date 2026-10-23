import type { Repository } from 'typeorm';
import type { Edition } from '../entities/edition.entity';
import { EditionRepository } from './edition.repository';

type TypeOrmMock = Record<'find' | 'findOneBy' | 'create' | 'save' | 'update', jest.Mock>;

function createFixture(): { repository: EditionRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<Edition>) => entity),
    save: jest.fn((entity: Partial<Edition>) => Promise.resolve(entity)),
    update: jest.fn(),
  };
  return { repository: new EditionRepository(typeorm as unknown as Repository<Edition>), typeorm };
}

describe('EditionRepository', () => {
  it('lists the editions with the most recent year first', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findAll();

    expect(typeorm.find).toHaveBeenCalledWith({ order: { year: 'DESC' } });
  });

  it('finds an edition by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById(3);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 3 });
  });

  it('finds an edition by year', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByYear(2026);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ year: 2026 });
  });

  it('saves a new edition', async () => {
    const { repository } = createFixture();
    const record = { year: 2027, name: 'Festividade 2027', description: null };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates an edition by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update(3, { name: 'Novo nome' });

    expect(typeorm.update).toHaveBeenCalledWith({ id: 3 }, { name: 'Novo nome' });
  });
});
