import { toMatchGroupResponse } from './match-group-response.mapper';

describe('toMatchGroupResponse', () => {
  it('exposes the public fields of the group', () => {
    const group = { id: 1, categoryId: 5, name: 'Grupo A' };

    expect(toMatchGroupResponse(group)).toEqual(group);
  });
});
