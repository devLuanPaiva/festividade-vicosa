import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import type { CreateEditionDto } from '../dto/create-edition.dto';
import type { UpdateEditionDto } from '../dto/update-edition.dto';
import type { Edition } from '../entities/edition.entity';
import { EditionRepository } from '../repository/edition.repository';

@Injectable()
export class EditionService {
  public constructor(private readonly editionRepository: EditionRepository) {}

  public list(): Promise<Edition[]> {
    return this.editionRepository.findAll();
  }

  public async findByIdOrFail(id: number): Promise<Edition> {
    const edition = await this.editionRepository.findById(id);
    if (!edition) {
      throw new NotFoundException(apiError('EDITION_NOT_FOUND', 'Edição não encontrada.', 'id'));
    }
    return edition;
  }

  public async create(input: CreateEditionDto): Promise<Edition> {
    await this.assertYearAvailable(input.year);
    return this.editionRepository.create({
      year: input.year,
      name: input.name,
      description: input.description ?? null,
    });
  }

  public async update(id: number, changes: UpdateEditionDto): Promise<Edition> {
    const current = await this.findByIdOrFail(id);
    if (changes.year !== undefined && changes.year !== current.year) {
      await this.assertYearAvailable(changes.year);
    }
    await this.editionRepository.update(id, changes);
    return this.findByIdOrFail(id);
  }

  private async assertYearAvailable(year: number): Promise<void> {
    if (await this.editionRepository.findByYear(year)) {
      throw new ConflictException(
        apiError('EDITION_YEAR_TAKEN', 'Já existe uma edição para este ano.', 'year'),
      );
    }
  }
}
