import { toTeamResponse } from './team-response.mapper';

describe('toTeamResponse', () => {
  it('exposes the public fields of the team', () => {
    const team = {
      id: '00000000-0000-4000-8000-000000000007',
      categoryId: '00000000-0000-4000-8000-000000000005',
      groupId: null,
      name: 'Bairro Centro',
      slug: 'bairro-centro',
      city: 'Viçosa',
      abbreviation: 'BCE',
      photoKey: null,
    };

    expect(toTeamResponse(team)).toEqual(team);
  });
});
