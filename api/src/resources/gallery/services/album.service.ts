import { BadRequestException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MatchService } from '../../match/services/match.service';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import type { Album } from '../entities/album.entity';
import { AlbumRepository, type AlbumDayRecord } from '../repository/album.repository';
import { isDayWithinRange } from '../rules/day-in-range.rule';

@Injectable()
export class AlbumService {
  public constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly subEventService: SubEventService,
    private readonly matchService: MatchService,
  ) {}

  public async listDays(subEventId: string): Promise<AlbumDayRecord[]> {
    await this.subEventService.findByIdOrFail(subEventId);
    return this.albumRepository.listEventDays(subEventId);
  }

  public async findForEventDay(subEventId: string, day: string): Promise<Album | null> {
    await this.subEventService.findByIdOrFail(subEventId);
    return this.albumRepository.findByEventDay(subEventId, day);
  }

  public async findForMatch(matchId: string): Promise<Album | null> {
    await this.matchService.findByIdOrFail(matchId);
    return this.albumRepository.findByMatch(matchId);
  }

  public async ensureForEventDay(subEventId: string, day: string): Promise<Album> {
    const subEvent = await this.subEventService.findByIdOrFail(subEventId);
    if (!isDayWithinRange(day, subEvent.startDate, subEvent.endDate)) {
      throw new BadRequestException(
        apiError('DAY_OUTSIDE_SUB_EVENT', 'Esta data está fora do período do sub-evento.', 'date'),
      );
    }
    return this.albumRepository.ensureForEventDay(subEventId, day);
  }

  public async ensureForMatch(matchId: string): Promise<Album> {
    await this.matchService.findByIdOrFail(matchId);
    return this.albumRepository.ensureForMatch(matchId);
  }
}
