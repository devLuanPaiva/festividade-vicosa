import { toMatchGroupResponse } from './match-group-response.mapper';

describe('toMatchGroupResponse', () => {
  it('exposes the public fields of the group', () => {
    const group = {
      id: '00000000-0000-4000-8000-000000000001',
      categoryId: '00000000-0000-4000-8000-000000000005',
      name: 'Grupo A',
    };

    expect(toMatchGroupResponse(group)).toEqual(group);
  });
});
