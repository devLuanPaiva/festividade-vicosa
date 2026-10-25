import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import { apiError } from '../errors/api-error';
import { ISO_DATE_PATTERN, VALIDATION_MESSAGES } from '../validation/validation-messages';

function isCalendarDay(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

@Injectable()
export class ParseDayPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!ISO_DATE_PATTERN.test(value) || !isCalendarDay(value)) {
      throw new BadRequestException(apiError('INVALID_DATE', VALIDATION_MESSAGES.date, 'date'));
    }
    return value;
  }
}
