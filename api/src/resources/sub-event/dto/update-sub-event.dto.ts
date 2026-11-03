import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSubEventDto } from './create-sub-event.dto';

export class UpdateSubEventDto extends PartialType(
  OmitType(CreateSubEventDto, ['type'] as const),
) {}
