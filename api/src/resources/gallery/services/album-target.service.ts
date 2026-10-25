import { BadRequestException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MediaFolder, type MediaTarget } from '../../../storage/rules/media-key.rule';
import { MatchMediaService } from '../../match/services/match-media.service';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import { eventDayFolders } from '../../sub-event/rules/event-day-folders.rule';
import { isDayWithinRange } from '../rules/day-in-range.rule';

@Injectable()
export class AlbumTargetService {
  public constructor(
    private readonly subEventService: SubEventService,
    private readonly matchMediaService: MatchMediaService,
  ) {}

  public async forEventDay(subEventId: string, day: string): Promise<MediaTarget> {
    const subEvent = await this.subEventService.findByIdOrFail(subEventId);
    if (!isDayWithinRange(day, subEvent.startDate, subEvent.endDate)) {
      throw new BadRequestException(
        apiError('DAY_OUTSIDE_SUB_EVENT', 'Esta data está fora do período do sub-evento.', 'date'),
      );
    }
    return { folder: MediaFolder.EVENT_PHOTO, segments: eventDayFolders(subEvent.type, day) };
  }

  public forMatch(matchId: string): Promise<MediaTarget> {
    return this.matchMediaService.targetFor(matchId, MediaFolder.MATCH_PHOTO);
  }
}
