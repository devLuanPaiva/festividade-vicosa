import { BadRequestException } from '@nestjs/common';
import { ParseDayPipe } from './parse-day.pipe';

describe('ParseDayPipe', () => {
  const pipe = new ParseDayPipe();

  it('passes a real calendar day through', () => {
    expect(pipe.transform('2026-12-09')).toBe('2026-12-09');
  });

  it.each(['2026-02-30', '2026-13-01', '09/12/2026', '2026-12-9', 'today'])(
    'refuses %s with the date field',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
      try {
        pipe.transform(value);
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          code: 'INVALID_DATE',
          field: 'date',
        });
      }
    },
  );
});
