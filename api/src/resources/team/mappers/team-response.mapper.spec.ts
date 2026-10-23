import { toTeamResponse } from './team-response.mapper';

describe('toTeamResponse', () => {
  it('exposes the public fields of the team', () => {
    const team = { id: 7, categoryId: 5, groupId: null, name: 'Bairro Centro' };

    expect(toTeamResponse(team)).toEqual(team);
  });
});
