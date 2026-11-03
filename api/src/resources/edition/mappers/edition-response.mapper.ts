import type { EditionResponseDto } from '../dto/edition-response.dto';
import type { Edition } from '../entities/edition.entity';

export function toEditionResponse(edition: Edition): EditionResponseDto {
  return {
    id: edition.id,
    year: edition.year,
    name: edition.name,
    description: edition.description,
  };
}
