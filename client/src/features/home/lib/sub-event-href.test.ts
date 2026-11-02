import type { SubEvent } from '@/features/schedule/types';
import { hrefOfType, subEventHref } from './sub-event-href';

const volleyball = { id: 'sub-event-9', type: 'JOCEV_BEACH_VOLLEYBALL' } as SubEvent;

describe('subEventHref', () => {
  it('sends championship events to their games', () => {
    expect(subEventHref({ id: 'x', type: 'JOCEV_FUTSAL' })).toBe(
      '/jogos?modalidade=futsal&jogos=proximos',
    );
    expect(subEventHref({ id: 'x', type: 'JOCEV_HANDBALL' })).toBe(
      '/jogos?modalidade=handebol&jogos=proximos',
    );
  });

  it('sends the other events to their photo album', () => {
    expect(subEventHref(volleyball)).toBe('/galeria/sub-event-9');
  });
});

describe('hrefOfType', () => {
  it('falls back to the gallery when the event is not published yet', () => {
    expect(hrefOfType('ECOPEDAL', [volleyball])).toBe('/galeria');
  });

  it('finds the event of the requested type', () => {
    expect(hrefOfType('JOCEV_BEACH_VOLLEYBALL', [volleyball])).toBe('/galeria/sub-event-9');
  });
});
