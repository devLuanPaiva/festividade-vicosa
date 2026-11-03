import { ILike, type Repository } from 'typeorm';
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

    await repository.findAll({});

    expect(typeorm.find).toHaveBeenCalledWith({ where: {}, order: { year: 'DESC' } });
  });

  it('filters the editions by year and name search', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findAll({ year: 2026, search: 'viçosa' });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { year: 2026, name: ILike('%viçosa%') },
      order: { year: 'DESC' },
    });
  });
});
