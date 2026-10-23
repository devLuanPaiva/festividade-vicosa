import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { EditionService } from '../../edition/services/edition.service';
import type { CreateSubEventDto } from '../dto/create-sub-event.dto';
import type { UpdateSubEventDto } from '../dto/update-sub-event.dto';
import type { SubEvent } from '../entities/sub-event.entity';
import type { SubEventType } from '../enums/sub-event-type.enum';
import { SubEventRepository } from '../repository/sub-event.repository';
import { isValidDateRange } from '../rules/date-range.rule';

@Injectable()
export class SubEventService {
  public constructor(
    private readonly subEventRepository: SubEventRepository,
    private readonly editionService: EditionService,
  ) {}

  public async listByEdition(editionId: number): Promise<SubEvent[]> {
    await this.editionService.findByIdOrFail(editionId);
    return this.subEventRepository.findByEdition(editionId);
  }

  public async findByIdOrFail(id: number): Promise<SubEvent> {
    const subEvent = await this.subEventRepository.findById(id);
    if (!subEvent) {
      throw new NotFoundException(
        apiError('SUB_EVENT_NOT_FOUND', 'Sub-evento não encontrado.', 'id'),
      );
    }
    return subEvent;
  }

  public async create(editionId: number, input: CreateSubEventDto): Promise<SubEvent> {
    await this.editionService.findByIdOrFail(editionId);
    this.assertValidDateRange(input.startDate, input.endDate);
    await this.assertTypeAvailable(editionId, input.type);

    return this.subEventRepository.create({
      editionId,
      type: input.type,
      name: input.name,
      description: input.description ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      location: input.location ?? null,
    });
  }

  public async update(id: number, changes: UpdateSubEventDto): Promise<SubEvent> {
    const current = await this.findByIdOrFail(id);
    this.assertValidDateRange(
      changes.startDate ?? current.startDate,
      changes.endDate ?? current.endDate,
    );
    await this.subEventRepository.update(id, changes);
    return this.findByIdOrFail(id);
  }

  private assertValidDateRange(startDate: string, endDate: string): void {
    if (!isValidDateRange(startDate, endDate)) {
      throw new BadRequestException(
        apiError(
          'INVALID_DATE_RANGE',
          'A data final não pode ser anterior à data inicial.',
          'endDate',
        ),
      );
    }
  }

  private async assertTypeAvailable(editionId: number, type: SubEventType): Promise<void> {
    if (await this.subEventRepository.findByEditionAndType(editionId, type)) {
      throw new ConflictException(
        apiError('SUB_EVENT_TYPE_TAKEN', 'Esta edição já possui um sub-evento deste tipo.', 'type'),
      );
    }
  }
}
