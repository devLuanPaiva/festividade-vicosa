import { describe, expect, it } from 'vitest';
import { buildScopeParams, situationParam, toQueryString, toStatusCounts } from './match-list-api';

const FILTERS = { search: 'Santa Luzia', categoryId: 'cat-1', stage: 'mata-mata', day: '' };

describe('buildScopeParams', () => {
  it('translates the address filters to the words the API understands and drops empty ones', () => {
    expect(buildScopeParams(FILTERS, 'sub-1')).toEqual({
      subEventId: 'sub-1',
      search: 'Santa Luzia',
      categoryId: 'cat-1',
      stage: 'KNOCKOUT',
    });
  });

  it('sends nothing for the default filters', () => {
    const none = { search: '', categoryId: '', stage: 'todas', day: '' };

    expect(buildScopeParams(none)).toEqual({});
  });
});

describe('situationParam', () => {
  it('asks the API for every situation except the one that means all', () => {
    expect(situationParam('todas')).toBe('');
    expect(situationParam('atrasadas')).toBe('overdue');
  });
});

describe('toStatusCounts', () => {
  it('names the totals the way the status chips do', () => {
    const counts = { total: 143, today: 0, overdue: 2, scheduled: 47, finalized: 96 };

    expect(toStatusCounts(counts)).toEqual({
      todas: 143,
      hoje: 0,
      atrasadas: 2,
      agendadas: 47,
      finalizadas: 96,
    });
  });
});

describe('toQueryString', () => {
  it('encodes the values safely', () => {
    expect(toQueryString({ search: 'São José & cia', day: '' })).toBe(
      'search=S%C3%A3o+Jos%C3%A9+%26+cia',
    );
  });
});
