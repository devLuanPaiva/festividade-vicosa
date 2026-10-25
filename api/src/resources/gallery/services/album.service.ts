import { Injectable } from '@nestjs/common';
import { MatchService } from '../../match/services/match.service';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import type { Album } from '../entities/album.entity';
import { AlbumRepository, type AlbumDayRecord } from '../repository/album.repository';

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

  public ensureForEventDay(subEventId: string, day: string): Promise<Album> {
    return this.albumRepository.ensureForEventDay(subEventId, day);
  }

  public ensureForMatch(matchId: string): Promise<Album> {
    return this.albumRepository.ensureForMatch(matchId);
  }
}
