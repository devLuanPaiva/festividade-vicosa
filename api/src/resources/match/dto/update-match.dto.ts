import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(
  PickType(CreateMatchDto, ['scheduledAt', 'location', 'teamAId', 'teamBId'] as const),
) {}
